'use client';
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/shared/auth/AuthProvider';
import useSignIn from '@/app/components/shared/auth/useSignIn';
import MainNavigation from '@/app/components/main/navigation/MainNavigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { signIn } = useSignIn();

  const handleLogout = () => {
    router.push('/auth/logout');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              minHeight: { lg: '100px' },
              width: '100%',
              paddingLeft: '0 !important',
              paddingRight: '0 !important',
            }}
          >
            {/* Left side - Logo */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                MyApp
              </Typography>
            </Box>

            {/* Center - Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <MainNavigation />
            </Box>

            {/* Right side - Auth Section */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={signIn}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        {children}
      </Box>

      <ToastContainer />
    </Box>
  );
}
