'use client';
import React from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Stack, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SUPPORTED_SOCIAL_PROVIDERS } from '@/app/constants/auth';

const CustomSocialButton = styled((props: any) => (
  <Button
    variant="outlined"
    size="large"
    color="inherit"
    {...props}
  />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

interface SocialLoginButtonsProps {
  title?: string;
}

export default function SocialLoginButtons({ title = 'Sign in with' }: SocialLoginButtonsProps) {
  const handleGoogleSignIn = async () => {
    try {
      // Store current location for redirect after login (if not already stored)
      if (typeof window !== 'undefined' && !localStorage.getItem('auth_redirect_after_login')) {
        localStorage.setItem('auth_redirect_after_login', window.location.pathname);
      }
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  // Don't render anything if no social providers are configured
  if (SUPPORTED_SOCIAL_PROVIDERS.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      spacing={2}
      mt={3}
    >
      {SUPPORTED_SOCIAL_PROVIDERS.includes('Google') && (
        <CustomSocialButton onClick={handleGoogleSignIn}>
          <Box
            sx={{
              width: 16,
              height: 16,
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              whiteSpace: 'nowrap',
              mr: { sm: '3px' },
            }}
          >
            {title}{' '}
          </Box>
          Google
        </CustomSocialButton>
      )}
    </Stack>
  );
}
