/**
 * Socket.IO server for real-time transcript streaming.
 *
 * Clients join a room keyed by sessionId. When ElevenLabs sends transcript
 * chunks via the post-call webhook (or a streaming endpoint), the server
 * broadcasts them to all connected clients in that room.
 *
 * Events emitted to clients:
 *   transcript:chunk  — { speaker, text, timestamp }
 *   call:status       — { status, sessionId }
 *   consent:verified  — { sessionId, timestamp }
 */

import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import type { User } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import { hasStaffAccess } from "./_core/trpc";
import { config } from "./config";
import { getCallSessionBySessionId, getUserByOpenId, insertTranscriptChunk } from "./db";

let io: SocketIOServer | null = null;

type SocketData = { user?: User };

export function initSocketIO(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      // Same-origin in production (portal domain). In dev, allow any origin
      // since the dev workflow may run behind tunnels or alternate ports.
      origin: process.env.NODE_ENV === "production" ? [config.appUrl] : true,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/api/socket.io",
  });

  // Auth middleware: every connection must present a valid session cookie.
  // Without this, anyone who knows or guesses a sessionId could subscribe
  // to live caregiver transcripts (PHI).
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error("unauthorized"));

      const cookies = parseCookieHeader(cookieHeader);
      const sessionToken = cookies[COOKIE_NAME];
      if (!sessionToken) return next(new Error("unauthorized"));

      const session = await sdk.verifySession(sessionToken);
      if (!session) return next(new Error("unauthorized"));

      const user = await getUserByOpenId(session.openId);
      if (!user) return next(new Error("unauthorized"));

      (socket.data as SocketData).user = user;
      next();
    } catch (err) {
      console.error("[Socket.IO] auth middleware error:", err);
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const connectedUser = (socket.data as SocketData).user;
    console.log(`[Socket.IO] Client connected: ${socket.id} user=${connectedUser?.id ?? "?"}`);

    // Client joins a session room to receive transcript updates
    socket.on("join:session", async (sessionId: string) => {
      if (!sessionId) return;

      const user = (socket.data as SocketData).user;
      if (!user) {
        socket.emit("error", { message: "Not authenticated" });
        return;
      }

      // Validate session exists
      const session = await getCallSessionBySessionId(sessionId).catch(() => null);
      if (!session) {
        socket.emit("error", { message: "Session not found" });
        return;
      }

      // Authorization: must own the session OR have staff/admin role.
      const isOwner = session.portalUserId === user.id;
      const isStaff = hasStaffAccess(user.role);
      if (!isOwner && !isStaff) {
        console.warn(
          `[Socket.IO] user=${user.id} denied join for session=${sessionId} (owner=${session.portalUserId})`
        );
        socket.emit("error", { message: "Not authorized for this session" });
        return;
      }

      socket.join(`session:${sessionId}`);
      console.log(`[Socket.IO] ${socket.id} (user=${user.id}) joined session: ${sessionId}`);
      socket.emit("joined", { sessionId, status: session.status });
    });

    socket.on("leave:session", (sessionId: string) => {
      socket.leave(`session:${sessionId}`);
      console.log(`[Socket.IO] ${socket.id} left session: ${sessionId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  console.log("[Socket.IO] Server initialized on /api/socket.io");
  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Broadcast a transcript chunk to all clients watching a session.
 * Also persists the chunk to the call_transcripts table.
 */
export async function broadcastTranscriptChunk(
  sessionId: string,
  chunk: { speaker: string; text: string; timestamp: number }
) {
  if (!io) return;
  io.to(`session:${sessionId}`).emit("transcript:chunk", { sessionId, ...chunk });

  // Persist to DB
  {
    try {
      const speakerValue = (chunk.speaker === "agent" || chunk.speaker === "user")
        ? chunk.speaker as "agent" | "user"
        : "user" as const;
      await insertTranscriptChunk({
        sessionId: sessionId,
        speaker: speakerValue,
        text: chunk.text,
        timestamp: new Date(chunk.timestamp),
      });
    } catch (err) {
      console.error("[Socket.IO] Failed to persist transcript chunk:", err);
    }
  }
}

/**
 * Broadcast a call status update (e.g., completed, synced).
 */
export function broadcastCallStatus(sessionId: string, status: string) {
  if (!io) return;
  io.to(`session:${sessionId}`).emit("call:status", { sessionId, status });
}

/**
 * Broadcast consent verification event.
 */
export function broadcastConsentVerified(sessionId: string) {
  if (!io) return;
  io.to(`session:${sessionId}`).emit("consent:verified", {
    sessionId,
    timestamp: Date.now(),
  });
}
