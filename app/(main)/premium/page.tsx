'use client';
import { Typography, Box, Container, Alert } from '@mui/material';
import PageContainer from '@/app/components/shared/PageContainer';
import { PremiumOnly } from '@/app/components/shared/auth/ProtectedRoute';

export default function PremiumPage() {
  return (
    <PremiumOnly>
      <PageContainer
        title="Premium Features"
        description="Access premium features"
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
              Premium Features
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Enhanced features for premium users
            </Typography>
          </Box>

          {/* Feature Preview */}
          <Alert
            severity="info"
            sx={{ mb: 4 }}
          >
            <Typography variant="h6">Premium Features Coming Soon</Typography>
            <Typography variant="body2">This page will include premium features and advanced functionality.</Typography>
          </Alert>

          {/* Placeholder Feature List */}
          <Box>
            <Typography
              variant="h5"
              gutterBottom
            >
              What&apos;s Included:
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ ml: 2 }}
            >
              • Advanced analytics and reporting
              <br />
              • Enhanced data export options
              <br />
              • Priority customer support
              <br />
              • Additional storage capacity
              <br />• Premium API access
            </Typography>
          </Box>
        </Container>
      </PageContainer>
    </PremiumOnly>
  );
}
