import { createHmac, timingSafeEqual } from "crypto";
import type { IncomingMessage } from "http";

export const ADMIN_COOKIE_NAME = "shim_admin_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

export function isAdminPasswordConfigured() {
  return getAdminPassword().trim().length > 0;
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();
  if (!configuredPassword) return false;

  const incoming = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);
  if (incoming.length !== expected.length) return false;
  return timingSafeEqual(incoming, expected);
}

function createSessionToken() {
  const secret = getSessionSecret();
  if (!secret) return "";

  return createHmac("sha256", secret)
    .update(`shim-ai-admin:${getAdminPassword()}`)
    .digest("hex");
}

function parseCookieHeader(cookieHeader = "") {
  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, chunk) => {
    const [rawName, ...rawValue] = chunk.trim().split("=");
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

export function isAdminRequestAuthenticated(req: IncomingMessage) {
  const token = parseCookieHeader(req.headers.cookie)[ADMIN_COOKIE_NAME];
  const expected = createSessionToken();
  if (!token || !expected) return false;

  const incoming = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  if (incoming.length !== expectedBuffer.length) return false;
  return timingSafeEqual(incoming, expectedBuffer);
}

export function createAdminSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(createSessionToken())}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    secure
  ]
    .filter(Boolean)
    .join("; ");
}
