import crypto from 'crypto';

const AUTH_SALT = 'maison_aroma_secret_salt_2026_x89';
const SESSION_SECRET = 'maison_aroma_session_jwt_secret_key_998877';

// Default Admin Credentials (can also be customized via ENV if desired)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@maisonaroma.it';
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MaisonAroma2026!Secured';

/**
 * Hash plain password with salt
 */
export function hashPassword(plainText: string): string {
  return crypto.pbkdf2Sync(plainText, AUTH_SALT, 10000, 64, 'sha512').toString('hex');
}

const STORED_PASSWORD_HASH = hashPassword(DEFAULT_ADMIN_PASSWORD);

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(userOrEmail: string, plainPassword: string): boolean {
  if (!userOrEmail || !plainPassword) return false;

  const cleanInput = userOrEmail.trim().toLowerCase();
  const validEmail = DEFAULT_ADMIN_EMAIL.toLowerCase();
  const validUser = DEFAULT_ADMIN_USERNAME.toLowerCase();

  const isUserValid = cleanInput === validEmail || cleanInput === validUser;
  const inputHash = hashPassword(plainPassword);

  return isUserValid && crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(STORED_PASSWORD_HASH));
}

/**
 * Generate a signed session token
 */
export function createSessionToken(): string {
  const payload = {
    user: DEFAULT_ADMIN_USERNAME,
    role: 'ADMIN',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

/**
 * Verify signed session token
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token || !token.includes('.')) return false;

  const [base64Payload, signature] = token.split('.');
  if (!base64Payload || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Payload)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }

  try {
    const payloadStr = Buffer.from(base64Payload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = 'maison_aroma_admin_session';
