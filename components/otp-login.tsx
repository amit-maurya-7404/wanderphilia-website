'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OTPLoginState {
  phone: string;
  otp: string;
  stage: 'phone' | 'otp';
  loading: boolean;
  error: string | null;
  success: string | null;
  resendTimer: number;
  canResend: boolean;
}

interface OTPLoginProps {
  embedded?: boolean;
  onSuccess?: () => void;
}

/**
 * OTP Login Component
 * Handles phone number input, OTP sending, and OTP verification via MSG91
 */
export default function OTPLogin({ embedded = false, onSuccess }: OTPLoginProps) {
  const router = useRouter();
  const [state, setState] = useState<OTPLoginState>({
    phone: '',
    otp: '',
    stage: 'phone',
    loading: false,
    error: null,
    success: null,
    resendTimer: 0,
    canResend: true,
  });

  // Resend timer countdown
  useEffect(() => {
    if (state.resendTimer <= 0) return;

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        resendTimer: prev.resendTimer - 1,
        canResend: prev.resendTimer - 1 <= 0,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.resendTimer]);

  /**
   * Handle send OTP button click
   */
  const handleSendOTP = useCallback(async () => {
    const trimmedPhone = state.phone.trim();

    // Validate phone input
    if (!trimmedPhone) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a phone number',
      }));
      return;
    }

    // Check phone number format (10 or 12 digits)
    const phoneRegex = /^(\d{10}|91\d{10})$/;
    if (!phoneRegex.test(trimmedPhone.replace(/\D/g, ''))) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a valid 10-digit phone number',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: null,
    }));

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: trimmedPhone }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (data.success) {
        setState((prev) => ({
          ...prev,
          stage: 'otp',
          success: 'OTP sent successfully! Check your SMS.',
          error: null,
          resendTimer: 30,
          canResend: false,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: data.message || 'Failed to send OTP',
          loading: false,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error:
          err instanceof Error ? err.message : 'An error occurred. Please try again.',
        loading: false,
      }));
    }
  }, [state.phone]);

  /**
   * Handle verify OTP button click
   */
  const handleVerifyOTP = useCallback(async () => {
    const trimmedOTP = state.otp.trim();

    // Validate OTP input
    if (!trimmedOTP) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter the OTP',
      }));
      return;
    }

    if (!/^\d{6}$/.test(trimmedOTP)) {
      setState((prev) => ({
        ...prev,
        error: 'OTP must be 6 digits',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: state.phone.trim(),
          otp: trimmedOTP,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
        token?: string;
      };

      if (data.success) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_phone', state.phone.trim());
        }

        setState((prev) => ({
          ...prev,
          success: 'Login successful! Redirecting...',
          loading: false,
        }));

        // If the login flow is embedded in a modal, propagate success to the caller.
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 500);
          return;
        }

        // Redirect to homepage after 1 second for standalone login flow.
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setState((prev) => ({
          ...prev,
          error: data.message || 'Failed to verify OTP',
          loading: false,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error:
          err instanceof Error ? err.message : 'An error occurred. Please try again.',
        loading: false,
      }));
    }
  }, [state.phone, state.otp, router]);

  /**
   * Handle resend OTP
   */
  const handleResendOTP = useCallback(async () => {
    if (!state.canResend) return;
    await handleSendOTP();
  }, [state.canResend, handleSendOTP]);

  /**
   * Handle go back to phone input
   */
  const handleGoBack = () => {
    setState((prev) => ({
      ...prev,
      stage: 'phone',
      otp: '',
      error: null,
      success: null,
    }));
  };

  const outerWrapperClass = embedded
    ? 'w-full'
    : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4';

  const cardClass = embedded
    ? 'bg-white rounded-3xl shadow-xl p-6 w-full max-w-xl'
    : 'bg-white rounded-lg shadow-xl p-8 w-full max-w-md';

  return (
    <div className={outerWrapperClass}>
      <div className={cardClass}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            {state.stage === 'phone'
              ? 'Enter your phone number to login'
              : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        {/* Phone Stage */}
        {state.stage === 'phone' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={state.phone}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    phone: e.target.value,
                    error: null,
                  }))
                }
                disabled={state.loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                Format: 10 digits (e.g., 9876543210)
              </p>
            </div>

            {/* Error Message */}
            {state.error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{state.error}</p>
              </div>
            )}

            {/* Send OTP Button */}
            <button
              onClick={handleSendOTP}
              disabled={state.loading || !state.phone.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {state.loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        )}

        {/* OTP Stage */}
        {state.stage === 'otp' && (
          <div className="space-y-6">
            {/* Success Message */}
            {state.success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-700 text-sm">{state.success}</p>
              </div>
            )}

            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={state.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setState((prev) => ({
                    ...prev,
                    otp: value,
                    error: null,
                  }));
                }}
                disabled={state.loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition text-center text-2xl tracking-widest disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                We sent a 6-digit code to {state.phone}
              </p>
            </div>

            {/* Error Message */}
            {state.error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{state.error}</p>
              </div>
            )}

            {/* Verify OTP Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={state.loading || state.otp.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {state.loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              {state.canResend ? (
                <button
                  onClick={handleResendOTP}
                  disabled={state.loading}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-600 text-sm">
                  Resend OTP in{' '}
                  <span className="font-semibold text-indigo-600">
                    {state.resendTimer}s
                  </span>
                </p>
              )}
            </div>

            {/* Go Back Button */}
            <button
              onClick={handleGoBack}
              disabled={state.loading}
              className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Phone Number
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          We will send an OTP to verify your phone number
        </p>
      </div>
    </div>
  );
}
