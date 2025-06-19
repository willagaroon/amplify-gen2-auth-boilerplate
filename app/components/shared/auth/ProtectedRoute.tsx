'use client';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from './AuthProvider';
import useSignIn from './useSignIn';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGroups?: string[];
  fallback?: React.ReactNode;
  silent?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireGroups = [],
  fallback,
  silent = false,
}) => {
  const { isAuthenticated, loading, groups } = useAuth();
  const { signIn } = useSignIn();

  // Show loading while checking auth
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    if (silent) {
      return null;
    }
    return (
      fallback || (
        <Box
          textAlign="center"
          p={4}
        >
          <Typography
            variant="h6"
            gutterBottom
          >
            Authentication Required
          </Typography>
          <Typography
            color="text.secondary"
            mb={2}
          >
            You need to sign in to access this content.
          </Typography>
          <Button
            variant="contained"
            onClick={signIn}
          >
            Sign In
          </Button>
        </Box>
      )
    );
  }

  // Check group requirements
  if (requireGroups.length > 0 && isAuthenticated) {
    const hasRequiredGroup = requireGroups.some((group) => groups.includes(group));
    if (!hasRequiredGroup) {
      if (silent) {
        return null;
      }
      return (
        fallback || (
          <Box
            textAlign="center"
            p={4}
          >
            <Typography
              variant="h6"
              gutterBottom
            >
              Access Restricted
            </Typography>
            <Typography
              color="text.secondary"
              mb={2}
            >
              You need {requireGroups.join(' or ')} access to view this content.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Your current groups: {groups.length > 0 ? groups.join(', ') : 'None'}
            </Typography>
          </Box>
        )
      );
    }
  }

  // All checks passed, show content
  return <>{children}</>;
};

// Convenience components for common use cases
export const AuthenticatedOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>
);

export const BasicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requireAuth={true}
    requireGroups={[]}
  >
    {children}
  </ProtectedRoute>
);

export const PremiumOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requireAuth={true}
    requireGroups={['premium']}
  >
    {children}
  </ProtectedRoute>
);

export const EditorOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requireAuth={true}
    requireGroups={['editor']}
  >
    {children}
  </ProtectedRoute>
);

export const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requireAuth={true}
    requireGroups={['admin']}
  >
    {children}
  </ProtectedRoute>
);

// Silent versions that don't show error messages
export const EditorOnlySilent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requireAuth={true}
    requireGroups={['editor']}
    silent={true}
  >
    {children}
  </ProtectedRoute>
);

export const AdminOnlySilent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requireAuth={true}
    requireGroups={['admin']}
    silent={true}
  >
    {children}
  </ProtectedRoute>
);
