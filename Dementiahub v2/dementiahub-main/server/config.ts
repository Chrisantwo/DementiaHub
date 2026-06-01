/**
 * Server-side configuration reads from environment variables.
 * All secrets must be supplied via environment configuration, never hardcoded.
 */

import crypto from "node:crypto";

function requireWebhookSecret(
  primaryKey: string,
  alternateKey: string,
  descriptor: string
): string {
  const primary = normalizeEnvValue(process.env[primaryKey]);
  const alternate = normalizeEnvValue(process.env[alternateKey]);
  const value = primary || alternate;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[FATAL] ${descriptor} (env: ${primaryKey} or ${alternateKey}) must be set in production. Refusing to start.`
    );
  }
  const fallback = crypto.randomBytes(32).toString("hex");
  console.warn(
    `[Config] ${descriptor} not set — using random per-process value. Set ${primaryKey} (or ${alternateKey}) to suppress this warning.`
  );
  return fallback;
}

function constantTimeStringEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function normalizeEnvValue(value: string | undefined): string {
  if (!value) return "";

  const trimmed = value.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;

  return unquoted;
}

export function normalizeBearerToken(value: string | undefined): string {
  const normalized = normalizeEnvValue(value);
  if (!normalized) return "";

  return normalized.replace(/^Bearer\s+/i, "").trim();
}

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  const normalized = normalizeEnvValue(value).toLowerCase();
  if (!normalized) return fallback;
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function parseCsvEnv(value: string | undefined): string[] {
  return normalizeEnvValue(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function normalizePhoneForComparison(value: string | undefined): string {
  return normalizeEnvValue(value).replace(/^whatsapp:/i, "").replace(/[^\d+]/g, "");
}

export function isApprovedOutboundQaNumber(
  phoneNumber: string,
  approvedNumbers: string[] = config.approvedQaPhoneNumbers
): boolean {
  const normalizedTarget = normalizePhoneForComparison(phoneNumber);
  if (!normalizedTarget) return false;

  return approvedNumbers
    .map((candidate) => normalizePhoneForComparison(candidate))
    .some((candidate) => candidate === normalizedTarget);
}

export const config = {
  // GHL API
  ghlApiKey: normalizeBearerToken(process.env.GHL_API_KEY),
  ghlLocationId: normalizeEnvValue(process.env.GHL_LOCATION_ID),
  // Cases pipeline - set GHL_CASES_PIPELINE_ID env var to override
  ghlCasesPipelineId:
    normalizeEnvValue(process.env.GHL_CASES_PIPELINE_ID) || "ybz3YPYHNnLwO90jm1ZP",

  // ElevenLabs API
  elevenLabsApiKey: normalizeBearerToken(process.env.ELEVENLABS_API_KEY),
  elevenLabsAgentId: normalizeEnvValue(process.env.ELEVENLABS_AGENT_ID),

  // Webhook secrets (for verifying inbound webhook authenticity).
  // No hardcoded fallback: in production, missing env throws at boot.
  // In dev, a random per-process value is generated so signature checks
  // reject all real webhook traffic (which is the safe default).
  elevenLabsPostCallWebhookSecret: requireWebhookSecret(
    "ELEVENLABS_POSTCALL_WEBHOOK_SECRET",
    "ELEVENLABS_WEBHOOK_SECRET",
    "ElevenLabs post-call webhook secret"
  ),
  elevenLabsConsentWebhookSecret: requireWebhookSecret(
    "ELEVENLABS_CONSENT_WEBHOOK_SECRET",
    "ELEVENLABS_WEBHOOK_SECRET",
    "ElevenLabs consent webhook secret"
  ),

  // App
  appUrl: normalizeEnvValue(process.env.APP_URL) || "http://localhost:3000",

  // QA outbound call guardrails
  voiceQaMode: parseBooleanEnv(process.env.VOICE_QA_MODE, true),
  approvedQaPhoneNumbers: parseCsvEnv(
    process.env.QA_APPROVED_PHONE_NUMBERS ?? process.env.VOICE_QA_APPROVED_NUMBERS
  ),
};

/**
 * Verify that a webhook request has the correct shared secret.
 * ElevenLabs sends the secret in the X-ElevenLabs-Secret header.
 */
export function verifyElevenLabsWebhookSecret(
  kind: "post_call" | "consent",
  incomingSecret: string | undefined
): boolean {
  if (!incomingSecret) return false;
  const expected =
    kind === "post_call"
      ? config.elevenLabsPostCallWebhookSecret
      : config.elevenLabsConsentWebhookSecret;
  if (!expected) return false;
  return constantTimeStringEqual(incomingSecret, expected);
}

/**
 * Check if GHL is properly configured.
 */
export function isGHLConfigured(): boolean {
  return Boolean(config.ghlApiKey && config.ghlLocationId);
}

/**
 * Check if ElevenLabs is properly configured.
 */
export function isElevenLabsConfigured(): boolean {
  return Boolean(config.elevenLabsApiKey && config.elevenLabsAgentId);
}
