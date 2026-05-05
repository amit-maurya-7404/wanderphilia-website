'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AuthButtonProps {
  loginClassName?: string;
  profileClassName?: string;
  logoutClassName?: string;
}

/**
 * AuthButton Component
 * Shows login button when not authenticated, profile menu when authenticated
 *
 * Usage:
 * ```tsx
 * <AuthButton
 *   loginClassName="px-4 py-2 bg-blue-500 text-white rounded"
 *   profileClassName="px-4 py-2 bg-gray-500 text-white rounded"
 * />
 * ```
 */
export function AuthButton({
  loginClassName = 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition',
  profileClassName = 'px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition',
  logoutClassName = 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition',
}: AuthButtonProps) {
  const { isAuthenticated, phone, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-medium">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login" className={loginClassName}>
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-700 px-3 py-2">
        📱 {phone?.slice(-4) ? `+91 XXXX ${phone.slice(-4)}` : 'User'}
      </div>
      <button onClick={handleLogout} className={logoutClassName}>
        Logout
      </button>
    </div>
  );
}
