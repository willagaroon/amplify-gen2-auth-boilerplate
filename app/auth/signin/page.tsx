'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/shared/PageContainer';
import CustomAuthLogin from '@/app/components/shared/auth/CustomAuthLogin';
import { useAuth } from '@/app/components/shared/auth/AuthProvider';

export default function SignInPage() {
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

  const handleSwitchToSignUp = () => {
    router.push('/auth/signup');
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageContainer
        title="Sign In"
        description="Sign in to your account"
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
              <CustomAuthLogin
                title="Welcome Back"
                subtitle={
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    mb={1}
                  >
                    Sign in to your account
                  </Typography>
                }
                onSuccess={handleAuthSuccess}
                onSwitchToSignUp={handleSwitchToSignUp}
              />
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
    </Box>
  );
}
