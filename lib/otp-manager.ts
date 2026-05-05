/**
 * In-memory OTP storage utility
 * In production, use Redis or a database with TTL
 */

interface OTPData {
  otp: string;
  createdAt: number;
  attempts: number;
}

// Map to store OTPs: key is phone number, value is OTP data
const otpStore = new Map<string, OTPData>();

// Cleanup interval: remove expired OTPs every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

// Start cleanup interval
if (typeof global !== 'undefined') {
  const globalObj = global as typeof global & {
    otpCleanupInterval?: NodeJS.Timeout;
  };

  if (!globalObj.otpCleanupInterval) {
    globalObj.otpCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [phone, data] of otpStore.entries()) {
        if (now - data.createdAt > OTP_EXPIRY_TIME) {
          otpStore.delete(phone);
        }
      }
    }, CLEANUP_INTERVAL);
  }
}

export const OtpManager = {
  /**
   * Store an OTP for a phone number
   */
  store(phone: string, otp: string): void {
    otpStore.set(phone, {
      otp,
      createdAt: Date.now(),
      attempts: 0,
    });
  },

  /**
   * Verify an OTP for a phone number
   */
  verify(phone: string, otp: string): { valid: boolean; message: string } {
    const data = otpStore.get(phone);

    if (!data) {
      return { valid: false, message: 'No OTP found for this phone number' };
    }

    // Check if OTP has expired
    if (Date.now() - data.createdAt > OTP_EXPIRY_TIME) {
      otpStore.delete(phone);
      return { valid: false, message: 'OTP has expired' };
    }

    // Check if max attempts exceeded
    if (data.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(phone);
      return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
    }

    // Increment attempts
    data.attempts += 1;

    // Verify OTP
    if (data.otp === otp) {
      otpStore.delete(phone);
      return { valid: true, message: 'OTP verified successfully' };
    }

    return { valid: false, message: 'Invalid OTP' };
  },

  /**
   * Clear OTP for a phone number
   */
  clear(phone: string): void {
    otpStore.delete(phone);
  },

  /**
   * Check if OTP exists for a phone number
   */
  exists(phone: string): boolean {
    return otpStore.has(phone);
  },
};
