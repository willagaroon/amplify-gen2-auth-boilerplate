'use client';
import 'aws-amplify/auth/enable-oauth-listener';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface AuthContextType {
  isAuthenticated: boolean | null;
  loading: boolean;
  user: any;
  groups: string[];
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<string[]>([]);

  const checkAuthState = async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth check timeout')), 5000);
      });

      const authPromise = getCurrentUser();

      const currentUser = (await Promise.race([authPromise, timeoutPromise])) as any;

      // If we get here, user is authenticated
      const session = await fetchAuthSession();

      setIsAuthenticated(true);
      setUser(currentUser);

      // Get groups from access token
      const accessToken = session.tokens?.accessToken;
      const userGroups = accessToken?.payload['cognito:groups'] || [];
      setGroups(Array.isArray(userGroups) ? userGroups.filter((g) => typeof g === 'string') : []);
    } catch {
      // User not authenticated - this is normal and expected
      setIsAuthenticated(false);
      setUser(null);
      setGroups([]);
    }
  };

  useEffect(() => {
    checkAuthState();

    // Listen for auth events including OAuth redirect events
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          await checkAuthState();
          break;
        case 'signedOut':
          setIsAuthenticated(false);
          setUser(null);
          setGroups([]);
          break;
        case 'signInWithRedirect':
          try {
            await checkAuthState();
          } catch (error) {
            console.error('❌ Error handling OAuth redirect:', error);
          }
          break;
        case 'signInWithRedirect_failure':
          console.error('❌ OAuth sign-in failed:', payload.data);
          setIsAuthenticated(false);
          setUser(null);
          setGroups([]);
          break;
        case 'customOAuthState':
          break;
      }
    });

    return unsubscribe;
  }, []);

  const refreshAuth = async () => {
    await fetchAuthSession({ forceRefresh: true });
    await checkAuthState();
  };

  const value: AuthContextType = {
    isAuthenticated,
    loading: isAuthenticated === null,
    user,
    groups,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
