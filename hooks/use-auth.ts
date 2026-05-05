import { useEffect, useState } from 'react';
import { AuthUtils } from '@/lib/auth-utils';

interface UseAuthReturn {
  isAuthenticated: boolean;
  phone: string | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
}

/**
 * Custom hook to manage authentication state
 * Usage: const { isAuthenticated, phone, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const auth = AuthUtils.getAuth();
    if (auth) {
      setIsAuthenticated(true);
      setPhone(auth.phone);
      setToken(auth.token);
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    AuthUtils.logout();
    setIsAuthenticated(false);
    setPhone(null);
    setToken(null);
  };

  return {
    isAuthenticated,
    phone,
    token,
    logout,
    isLoading,
  };
}
