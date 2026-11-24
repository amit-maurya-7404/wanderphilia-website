import { NextRequest } from 'next/server';
import * as crypto from 'crypto';

const AUTH_SECRET_SALT = process.env.OPS_SECRET_SALT || 'wanderphilia-ops-secure-salt-2027';

/**
 * Valid allowed PINs for Operations Team
 */
const OPS_VALID_PINS: string[] = [
  '6767',
  (process.env.OPERATIONS_ACCESS_CODE || '').trim(),
  'WANDER-OPS-2027',
  '921766',
  '202799',
  'WANDER-2027',
  'ops@wander2027'
].filter(Boolean);

/**
 * Valid allowed PINs for Sales Team
 */
const SALES_VALID_PINS: string[] = [
  '6767',
  (process.env.SALES_ACCESS_CODE || '').trim(),
  'WANDER-SALES-2027',
  '843125',
  '771920',
  '202799',
  'WANDER-2027',
  'sales@wander2027'
].filter(Boolean);

/**
 * Verifies passcode for a specific role or both
 */
export function verifyPasscode(passcode: string, expectedRole: 'operations' | 'sales' | 'any' = 'any'): { valid: boolean; role: 'operations_team' | 'sales_team' | null } {
  if (!passcode) return { valid: false, role: null };
  const clean = passcode.trim().toLowerCase();

  const isOps = OPS_VALID_PINS.some(p => p.toLowerCase() === clean);
  const isSales = SALES_VALID_PINS.some(p => p.toLowerCase() === clean);

  if (expectedRole === 'operations') {
    return { valid: isOps, role: isOps ? 'operations_team' : null };
  }
  if (expectedRole === 'sales') {
    return { valid: isSales, role: isSales ? 'sales_team' : null };
  }

  // Any
  if (isOps && !isSales) return { valid: true, role: 'operations_team' };
  if (isSales && !isOps) return { valid: true, role: 'sales_team' };
  if (isOps && isSales) return { valid: true, role: 'operations_team' };

  return { valid: false, role: null };
}

/**
 * Generates a signed token for a role
 */
export function generateOperationsToken(passcode: string, role: 'operations_team' | 'sales_team' = 'operations_team'): string {
  const payload = {
    passcode,
    timestamp: Date.now(),
    role,
  };
  const str = JSON.stringify(payload);
  const hash = crypto.createHmac('sha256', AUTH_SECRET_SALT).update(str).digest('hex');
  const base64Str = Buffer.from(str).toString('base64');
  return `${base64Str}.${hash}`;
}

/**
 * Verifies a token
 */
export function verifyOperationsToken(token: string | null | undefined, allowedRole: 'operations_team' | 'sales_team' | 'any' = 'any'): boolean {
  if (!token) return false;

  try {
    const [base64Str, hash] = token.split('.');
    if (!base64Str || !hash) return false;

    const str = Buffer.from(base64Str, 'base64').toString('utf8');
    const expectedHash = crypto.createHmac('sha256', AUTH_SECRET_SALT).update(str).digest('hex');

    if (hash !== expectedHash) return false;

    const payload = JSON.parse(str);
    if (!payload || !payload.timestamp) return false;

    // Token valid for 7 days
    const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.timestamp > MAX_AGE_MS) {
      return false;
    }

    if (allowedRole !== 'any' && payload.role && payload.role !== allowedRole) {
      // Check if passcode is valid for the requested role anyway (e.g. Master PIN)
      const roleCheck = verifyPasscode(payload.passcode, allowedRole === 'operations_team' ? 'operations' : 'sales');
      if (!roleCheck.valid) return false;
    }

    const { valid } = verifyPasscode(payload.passcode);
    return valid;
  } catch (err) {
    return false;
  }
}

/**
 * Helper to authenticate API requests for operations
 */
export function isAuthorizedOperationsRequest(req: NextRequest, allowedRole: 'operations_team' | 'sales_team' | 'any' = 'any'): boolean {
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    if (verifyOperationsToken(token, allowedRole)) return true;
  }

  const customHeader = req.headers.get('x-operations-token') || req.headers.get('x-sales-token') || '';
  if (customHeader && verifyOperationsToken(customHeader, allowedRole)) return true;

  const cookie = req.cookies.get('wanderphilia_ops_token')?.value || req.cookies.get('wanderphilia_sales_token')?.value;
  if (cookie && verifyOperationsToken(cookie, allowedRole)) return true;

  return false;
}
