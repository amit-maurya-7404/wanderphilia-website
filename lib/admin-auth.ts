// lib/admin-auth.ts
// Robust, high-security admin authentication with Web Crypto HMAC-SHA256
// Compatible with both Edge Middleware and Node.js API Routes

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'experiences@wanderphilia.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'WE@2026';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'wanderphilia_super_secure_admin_jwt_secret_key_2026_xyz';
export const ADMIN_COOKIE_NAME = 'wander_admin_session';

// Brute-force protection tracking
interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (record) {
    if (record.lockedUntil > now) {
      const waitMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      return { allowed: false, waitMinutes };
    }
    // Lockout expired, reset
    if (record.lockedUntil <= now && record.attempts >= MAX_ATTEMPTS) {
      loginAttempts.delete(identifier);
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(identifier: string): { remainingAttempts: number; isLocked: boolean } {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    loginAttempts.set(identifier, record);
    return { remainingAttempts: 0, isLocked: true };
  }

  loginAttempts.set(identifier, record);
  return { remainingAttempts: MAX_ATTEMPTS - record.attempts, isLocked: false };
}

export function resetFailedAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

// Convert string to Uint8Array
function strToUint8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Base64Url helpers
function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlToUint8(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Timing safe equality
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

// Get crypto key for HMAC
async function getHmacKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    strToUint8(ADMIN_SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed tamper-proof session token for admin
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60; // 7 days valid
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), iat, exp });
  const payloadB64 = bufferToBase64Url(strToUint8(payload));

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign('HMAC', key, strToUint8(payloadB64));
  const signatureB64 = bufferToBase64Url(signature);

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies the admin session token
 */
export async function verifyAdminSessionToken(token?: string | null): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getHmacKey();
    const expectedSig = await crypto.subtle.sign('HMAC', key, strToUint8(payloadB64));
    const receivedSig = base64UrlToUint8(signatureB64);

    if (!timingSafeEqual(new Uint8Array(expectedSig), receivedSig)) {
      return { valid: false };
    }

    const payloadJson = new TextDecoder().decode(base64UrlToUint8(payloadB64));
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false }; // Expired
    }

    if (payload.email !== ADMIN_EMAIL.toLowerCase().trim()) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Validates admin credentials against configured email & password
 */
export async function validateAdminCredentials(email: string, pass: string): Promise<boolean> {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanPass = (pass || '').trim();

  const expectedEmail = ADMIN_EMAIL.toLowerCase().trim();
  const expectedPass = ADMIN_PASSWORD.trim();

  // Compare lengths and characters in constant time
  const emailMatch = timingSafeEqual(strToUint8(cleanEmail), strToUint8(expectedEmail));
  const passMatch = timingSafeEqual(strToUint8(cleanPass), strToUint8(expectedPass));

  return emailMatch && passMatch;
}

