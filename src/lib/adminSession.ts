import { env } from "@/src/env";

const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_VERSION = "v1";

function getAdminSessionSecret(): string {
  return env.COOKIE_SECRET;
}

export function getConfiguredAdminPin(): string {
  return env.ADMIN_PIN;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function createSignature(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToHex(new Uint8Array(signature));
}

export async function createAdminSessionToken(expiresAt: number): Promise<string> {
  const secret = getAdminSessionSecret();
  if (!secret) {
    throw new Error("Missing admin session secret configuration.");
  }

  const payload = `${SESSION_VERSION}:${expiresAt}`;
  const signature = await createSignature(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  const secret = getAdminSessionSecret();
  if (!secret || !token) return false;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return false;

  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  if (!payload.startsWith(`${SESSION_VERSION}:`)) return false;

  const [, expiryText] = payload.split(":");
  const expiresAt = Number(expiryText);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  const expectedSignature = await createSignature(payload, secret);
  return timingSafeEqual(signature, expectedSignature);
}
