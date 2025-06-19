'use client';
import { Typography, Box, Chip, Stack, Button } from '@mui/material';
import PageContainer from '@/app/components/shared/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import { AuthenticatedOnly, PremiumOnly, EditorOnly, AdminOnly } from '@/app/components/shared/auth/ProtectedRoute';
import { useAuth } from '@/app/components/shared/auth/AuthProvider';

export default function DashboardPage() {
  const { user, groups, refreshAuth } = useAuth();

  const handleRefresh = async () => {
    console.log('🔄 Manually refreshing auth state...');
    await refreshAuth();
  };

  return (
    <AuthenticatedOnly>
      <PageContainer
        title="Dashboard"
        description="Your Admin Dashboard"
      >
        <DashboardCard title="Dashboard">
          <Typography mb={3}>Welcome to your admin dashboard.</Typography>

          <Box
            mb={3}
            p={2}
            bgcolor="background.paper"
            borderRadius={1}
          >
            <Typography
              variant="h6"
              gutterBottom
            >
              Your Account Info
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={1}
            >
              User: {user?.username || 'Unknown'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={2}
            >
              Groups:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              mb={2}
            >
              {groups.length > 0 ? (
                groups.map((group) => (
                  <Chip
                    key={group}
                    label={group}
                    size="small"
                    color="primary"
                  />
                ))
              ) : (
                <Chip
                  label="No groups assigned"
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefresh}
            >
              Refresh Groups
            </Button>
          </Box>

          <Box mb={3}>
            <AuthenticatedOnly>
              <Typography
                color="primary"
                variant="h6"
              >
                ✅ Authenticated Content
              </Typography>
              <Typography>This content is only visible to signed-in users.</Typography>
            </AuthenticatedOnly>
          </Box>

          <Box mb={3}>
            <PremiumOnly>
              <Typography
                color="warning.main"
                variant="h6"
              >
                ⭐ Premium Content
              </Typography>
              <Typography>This content requires premium access.</Typography>
            </PremiumOnly>
          </Box>

          <Box mb={3}>
            <EditorOnly>
              <Typography
                color="info.main"
                variant="h6"
              >
                ✏️ Editor Content
              </Typography>
              <Typography>This content requires editor access.</Typography>
            </EditorOnly>
          </Box>

          <Box>
            <AdminOnly>
              <Typography
                color="error.main"
                variant="h6"
              >
                🔧 Admin Content
              </Typography>
              <Typography>This content requires admin access.</Typography>
            </AdminOnly>
          </Box>
        </DashboardCard>
      </PageContainer>
    </AuthenticatedOnly>
  );
}
