'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import { Box, Typography, CircularProgress } from '@mui/material';

import PageContainer from '@/app/components/shared/PageContainer';

export default function LogoutPage() {
  const [status, setStatus] = useState<'signing-out' | 'success' | 'error'>('signing-out');
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        setStatus('signing-out');

        // Sign out from Amplify
        await signOut();

        setStatus('success');

        // Wait a moment then redirect
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (error) {
        console.error('❌ Sign out failed:', error);
        setStatus('error');

        // Even if sign out fails, redirect after a moment
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    performSignOut();
  }, [router]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageContainer title="Signing Out">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 200px)"
          gap={2}
        >
          {status === 'signing-out' && (
            <>
              <CircularProgress size={40} />
              <Typography variant="h6">Signing you out...</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Please wait while we securely sign you out
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Typography
                variant="h6"
                color="success.main"
              >
                ✅ Successfully signed out
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Redirecting to homepage...
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Typography
                variant="h6"
                color="error.main"
              >
                ❌ Sign out encountered an issue
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Redirecting to homepage anyway...
              </Typography>
            </>
          )}
        </Box>
      </PageContainer>
    </Box>
  );
}
