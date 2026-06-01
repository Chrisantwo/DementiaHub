import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV, resolvePortalRole } from "./_core/env";
import { hashPassword, sdk, verifyPassword } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import {
  loginRateLimit,
  protectedProcedure,
  publicProcedure,
  registerRateLimit,
  router,
} from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import * as db from "./db";
import { aiRouter } from "./routers/ai";
import { callsRouter } from "./routers/calls";
import { ghlRouter } from "./routers/ghl";
import { identityRouter } from "./routers/identity";
import { ensureGHLIdentity, recordPortalSignupConsent } from "./services/identitySync";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => {
      const user = opts.ctx.user;
      if (!user) return null;
      const { passwordHash, ...safeUser } = user;
      void passwordHash;
      return safeUser;
    }),

    register: publicProcedure
      .use(registerRateLimit)
      .input(
        z.object({
          name: z.string().min(1).max(256),
          email: z.string().email().max(320),
          password: z.string().min(8).max(256),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists." });
        }

        const openId = nanoid();
        const passwordHash = await hashPassword(input.password);
        const role = resolvePortalRole(input.email);

        await db.upsertUser({
          openId,
          name: input.name,
          email: input.email,
          passwordHash,
          loginMethod: "email",
          lastSignedIn: new Date(),
          role,
        });

        const token = await sdk.createSessionToken(openId, {
          name: input.name,
          expiresInMs: ONE_YEAR_MS,
        });
        ctx.res.cookie(COOKIE_NAME, token, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: ONE_YEAR_MS,
        });

        const createdUser = await db.getUserByEmail(input.email);
        if (createdUser) {
          await recordPortalSignupConsent({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            openId: createdUser.openId,
          }).catch((err) => {
            console.warn("[Register] Failed to record portal consent:", err);
          });
        }

        return { success: true } as const;
      }),

    login: publicProcedure
      .use(loginRateLimit)
      .input(
        z.object({
          email: z.string().email().max(320),
          password: z.string().min(1).max(256),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByEmail(input.email);
        // Always run scrypt to keep response timing constant whether the
        // user exists or not — prevents account-enumeration via timing.
        // The dummy hash is shaped like a real one (<128 hex chars>.<32 hex chars>)
        // so verifyPassword runs the full scrypt path before the compare.
        const DUMMY_HASH = "0".repeat(128) + "." + "0".repeat(32);
        const targetHash = user?.passwordHash ?? DUMMY_HASH;
        const passwordOk = await verifyPassword(input.password, targetHash);
        const role = resolvePortalRole(input.email);

        if (!user || !user.passwordHash || !passwordOk) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        }

        const token = await sdk.createSessionToken(user.openId, {
          name: user.name ?? "",
          expiresInMs: ONE_YEAR_MS,
        });
        ctx.res.cookie(COOKIE_NAME, token, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: ONE_YEAR_MS,
        });

        // Set role unconditionally so removing an email from ADMIN_EMAILS /
        // STAFF_EMAILS actually demotes the user on their next login.
        // Previously this only upgraded, never downgraded.
        await db.upsertUser({
          openId: user.openId,
          lastSignedIn: new Date(),
          role,
        });
        return { success: true } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    postLoginSync: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        await ensureGHLIdentity({
          id: ctx.user.id,
          name: ctx.user.name,
          email: ctx.user.email,
          openId: ctx.user.openId,
        });
      } catch (err) {
        console.warn("[PostLoginSync] GHL identity sync failed:", err);
      }
      return { success: true };
    }),
  }),

  calls: callsRouter,
  ai: aiRouter,
  identity: identityRouter,
  ghl: ghlRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
