'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '@/app/components/shared/auth/AuthProvider';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Get the intended destination from localStorage
        const intendedRoute = localStorage.getItem('auth_redirect_after_login') || '/';

        // Clear the stored route
        localStorage.removeItem('auth_redirect_after_login');

        // Redirect to intended destination

        router.push(intendedRoute);
      } else {
        // Authentication failed, redirect to signin

        router.push('/auth/signin');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="h6">Completing sign in...</Typography>
      <Typography
        variant="body2"
        color="text.secondary"
      >
        Please wait while we redirect you
      </Typography>
    </Box>
  );
}
