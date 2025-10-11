import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Password strength type (0 = no password, 4 = very strong)
 */
export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/**
 * Calculate password strength based on various criteria
 * Returns a score from 0 (no password) to 4 (very strong)
 * @param password - Plain text password to evaluate
 * @returns Password strength score
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return Math.min(strength, 4) as PasswordStrength;
}

/**
 * Get human-readable label for password strength
 * @param strength - Password strength score
 * @returns Label string ('Weak', 'Medium', 'Strong', or empty string)
 */
export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  if (strength === 0) return '';
  if (strength <= 2) return 'Weak';
  if (strength === 3) return 'Medium';
  return 'Strong';
}

/**
 * Get Tailwind CSS color class for password strength indicator
 * @param strength - Password strength score
 * @returns Tailwind color class name
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  if (strength === 0) return '';
  if (strength <= 2) return 'bg-red-500';
  if (strength === 3) return 'bg-yellow-500';
  return 'bg-green-500';
}