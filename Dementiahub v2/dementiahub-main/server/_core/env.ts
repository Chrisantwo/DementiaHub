import { randomBytes } from "node:crypto";

function requireSecret(key: string, descriptor: string): string {
  const value = process.env[key];
  if (value && value.length > 0) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[FATAL] ${descriptor} (env: ${key}) must be set in production. Refusing to start.`
    );
  }
  const fallback = randomBytes(32).toString("hex");
  console.warn(
    `[ENV] ${descriptor} (${key}) not set — using random per-process value. Sessions will not persist across restarts. Set ${key} in your .env to suppress this warning.`
  );
  return fallback;
}

function parseEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

const adminEmails = Array.from(
  new Set([
    ...parseEmails(process.env.ADMIN_EMAILS),
    ...parseEmails(process.env.ADMIN_EMAIL),
  ])
);

const staffEmails = Array.from(
  new Set([
    ...parseEmails(process.env.STAFF_EMAILS),
    ...parseEmails(process.env.STAFF_EMAIL),
  ])
);

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}

export function isStaffEmail(email: string | null | undefined) {
  if (!email) return false;
  return staffEmails.includes(email.trim().toLowerCase());
}

export function resolvePortalRole(email: string | null | undefined): "admin" | "staff" | "user" {
  if (isAdminEmail(email)) return "admin";
  if (isStaffEmail(email)) return "staff";
  return "user";
}

export const ENV = {
  cookieSecret: requireSecret("JWT_SECRET", "Session JWT secret"),
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminEmails,
  staffEmail: process.env.STAFF_EMAIL ?? "",
  staffEmails,
  // Storage proxy (optional - only needed if file upload features are used)
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
