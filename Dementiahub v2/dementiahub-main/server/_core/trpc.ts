import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const isProduction = process.env.NODE_ENV === "production";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (isProduction && error.code === "INTERNAL_SERVER_ERROR") {
      return {
        ...shape,
        message: "Internal server error",
        data: { ...shape.data, stack: undefined },
      };
    }
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export function hasStaffAccess(role: string | null | undefined) {
  return role === "admin" || role === "staff";
}

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

export const staffProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || !hasStaffAccess(ctx.user.role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Staff or admin access required" });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

// ─── Rate limiting ──────────────────────────────────────────────────────────
// Simple in-memory per-IP buckets. Process-local; if you scale to multiple
// instances, swap this for a shared store (Redis). Periodic cleanup prevents
// unbounded memory growth.

type RateLimitBucket = { count: number; resetAt: number };
const rateLimitBuckets = new Map<string, RateLimitBucket>();

setInterval(() => {
  const now = Date.now();
  rateLimitBuckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  });
}, 5 * 60 * 1000).unref();

function getClientIp(req: TrpcContext["req"]): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip ?? req.socket?.remoteAddress ?? "unknown";
}

function createRateLimit(opts: { windowMs: number; max: number; keyPrefix: string }) {
  return t.middleware(async ({ ctx, next }) => {
    // Skip in tests so test suites that exercise login many times aren't
    // throttled. Production and dev still get the protection.
    if (process.env.NODE_ENV === "test") return next();

    const key = `${opts.keyPrefix}:${getClientIp(ctx.req)}`;
    const now = Date.now();
    const existing = rateLimitBuckets.get(key);

    if (!existing || existing.resetAt <= now) {
      rateLimitBuckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    } else {
      if (existing.count >= opts.max) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests. Please try again in a few minutes.",
        });
      }
      existing.count++;
    }

    return next();
  });
}

export const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyPrefix: "login",
});

export const registerRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyPrefix: "register",
});
