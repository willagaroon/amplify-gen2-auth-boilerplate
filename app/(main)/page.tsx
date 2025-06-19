'use client';
import { Typography, Box, Container, Button } from '@mui/material';
import useSignIn from '@/app/components/shared/auth/useSignIn';

export default function HomePage() {
  const { signIn } = useSignIn();

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
    >
      {/* Hero Section */}
      <Box
        textAlign="center"
        mb={8}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Welcome to MyApp
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          mb={4}
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          A modern web application built with Amplify Gen 2
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={signIn}
        >
          Get Started
        </Button>
      </Box>

      {/* Placeholder Content */}
      <Box textAlign="center">
        <Typography
          variant="h4"
          gutterBottom
        >
          Ready to Build
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
        >
          This is your starting point. Customize this page and add your application&apos;s features.
        </Typography>
      </Box>
    </Container>
  );
}
