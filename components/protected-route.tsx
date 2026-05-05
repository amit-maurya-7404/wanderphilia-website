'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps components that should only be accessible to authenticated users
 *
 * Usage:
 * ```tsx
 * import { ProtectedRoute } from '@/components/protected-route';
 *
 * export default function BookingPage() {
 *   return (
 *     <ProtectedRoute>
 *       <h1>Booking Page</h1>
 *       {/* Content */}
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
