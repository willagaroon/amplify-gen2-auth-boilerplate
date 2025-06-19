'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/shared/PageContainer';
import CustomAuthSignUp from '@/app/components/shared/auth/CustomAuthSignUp';
import { useAuth } from '@/app/components/shared/auth/AuthProvider';

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Use unified redirect logic
      const intendedRoute = localStorage.getItem('auth_redirect_after_login') || '/';
      localStorage.removeItem('auth_redirect_after_login');

      router.push(intendedRoute);
    }
  }, [isAuthenticated, router]);

  const handleAuthSuccess = () => {
    // AuthProvider will update state, then redirect via useEffect
  };

  const handleSwitchToSignIn = () => {
    router.push('/auth/signin');
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageContainer
        title="Sign Up"
        description="Create your account"
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ minHeight: 'calc(100vh - 200px)', py: 4 }}
        >
          <Grid
            size={{ xs: 12, sm: 10, md: 8, lg: 6, xl: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              p={4}
              width="100%"
              maxWidth={400}
            >
              <CustomAuthSignUp
                title="Create Account"
                subtitle={
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    mb={1}
                  >
                    Create your account to get started
                  </Typography>
                }
                onSuccess={handleAuthSuccess}
                onSwitchToSignIn={handleSwitchToSignIn}
              />
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
    </Box>
  );
}
