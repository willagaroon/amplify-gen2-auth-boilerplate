'use client';
import { Typography, Box, Container, Alert } from '@mui/material';
import PageContainer from '@/app/components/shared/PageContainer';
import { AuthenticatedOnly } from '@/app/components/shared/auth/ProtectedRoute';

export default function BasicPage() {
  return (
    <AuthenticatedOnly>
      <PageContainer
        title="Basic Features"
        description="Access basic features"
      >
        <Container
          maxWidth="lg"
          sx={{ py: 4 }}
        >
          {/* Hero Section */}
          <Box
            textAlign="center"
            mb={6}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Basic Features
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Essential tools for all users
            </Typography>
          </Box>

          {/* Feature Preview */}
          <Alert
            severity="success"
            sx={{ mb: 4 }}
          >
            <Typography variant="h6">Getting Started</Typography>
            <Typography variant="body2">
              This page will include basic features available to all authenticated users.
            </Typography>
          </Alert>

          {/* Placeholder Feature List */}
          <Box>
            <Typography
              variant="h5"
              gutterBottom
            >
              What&apos;s Available:
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ ml: 2 }}
            >
              • User profile management
              <br />
              • Basic data access
              <br />
              • Standard features
              <br />
              • Community access
              <br />• Basic support
            </Typography>
          </Box>
        </Container>
      </PageContainer>
    </AuthenticatedOnly>
  );
}
