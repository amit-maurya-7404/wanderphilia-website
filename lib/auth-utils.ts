/**
 * Authentication utility functions
 * Handles token storage, retrieval, and validation
 */

interface AuthData {
  phone: string;
  token: string;
  expiresAt: number;
}

const STORAGE_KEY = 'auth_data';
const TOKEN_KEY = 'auth_token';
const PHONE_KEY = 'user_phone';

export const AuthUtils = {
  /**
   * Save authentication data to localStorage
   */
  saveAuth(token: string, phone: string): void {
    try {
      const authData: AuthData = {
        phone,
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(PHONE_KEY, phone);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  },

  /**
   * Get authentication data from localStorage
   */
  getAuth(): AuthData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const authData = JSON.parse(data) as AuthData;

      // Check if token has expired
      if (authData.expiresAt < Date.now()) {
        AuthUtils.clearAuth();
        return null;
      }

      return authData;
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return null;
    }
  },

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  /**
   * Get the user's phone number
   */
  getPhone(): string | null {
    try {
      return localStorage.getItem(PHONE_KEY);
    } catch (error) {
      console.error('Error retrieving phone:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const auth = AuthUtils.getAuth();
    return auth !== null;
  },

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PHONE_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    AuthUtils.clearAuth();
  },
};
