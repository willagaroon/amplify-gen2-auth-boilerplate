'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { showPromiseToast } from '@/utils/toast';

const client = generateClient<Schema>();

interface UserProfile {
  cognitoUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  userTier?: 'basic' | 'premium' | 'editor' | 'admin';
}

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUserUpdated: () => void;
}

export default function EditUserDialog({ open, onClose, user, onUserUpdated }: EditUserDialogProps) {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'editor' | 'admin'>('basic');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize selected tier when user changes
  React.useEffect(() => {
    if (user) {
      setSelectedTier(user.userTier || 'basic');
      setError(null);
      setSuccess(null);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Close dialog immediately when saving starts
    onClose();

    // Create the update operation as a promise
    const updateOperation = async () => {
      // Update Cognito groups via our custom mutation
      const groupResult = await client.mutations.updateUserTier({
        userId: user.cognitoUserId,
        newTier: selectedTier,
        currentTier: user.userTier || 'basic',
      });

      console.log('Group update result:', groupResult);

      // Check if the mutation returned GraphQL errors
      if (groupResult.errors && groupResult.errors.length > 0) {
        const graphqlError = groupResult.errors[0];
        let errorMessage = 'Failed to update user tier.';

        if (graphqlError.errorType === 'Unauthorized') {
          errorMessage = 'You do not have permission to manage user access. Please contact an administrator.';
        } else if (graphqlError.message) {
          errorMessage = `Error: ${graphqlError.message}`;
        }

        throw new Error(errorMessage);
      }

      // Check if the Lambda function returned an error result
      if (groupResult.data) {
        let lambdaResult;
        try {
          // Parse the JSON response from the Lambda function
          lambdaResult = typeof groupResult.data === 'string' ? JSON.parse(groupResult.data) : groupResult.data;
        } catch (parseError) {
          console.error('Failed to parse Lambda response:', parseError);
          throw new Error('Invalid response from server. Please try again.');
        }

        // Check if the Lambda function reported an error
        if (lambdaResult.success === false) {
          let errorMessage = 'Failed to update user tier.';

          if (lambdaResult.message) {
            if (lambdaResult.message.includes('AccessDeniedException')) {
              errorMessage = 'Server does not have permission to manage user groups. Please contact an administrator.';
            } else if (lambdaResult.message.includes('not authorized')) {
              errorMessage = 'Authentication error. Please contact an administrator.';
            } else {
              errorMessage = `Server error: ${lambdaResult.message}`;
            }
          }

          throw new Error(errorMessage);
        }
      }

      // Update the UserProfile record in the database
      await client.models.UserProfile.update({
        cognitoUserId: user.cognitoUserId,
        userTier: selectedTier,
      });

      // Refresh the users list
      onUserUpdated();

      return `User access successfully updated to ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}`;
    };

    // Use promise toast for better UX
    const userName = getDisplayName(user);
    const tierName = selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);

    showPromiseToast(updateOperation(), {
      pending: `Updating ${userName}'s access to ${tierName}...`,
      success: `${userName}'s access successfully updated to ${tierName}`,
      error: 'Failed to update user access. Please try again.',
    });
  };

  const getDisplayName = (userProfile: UserProfile) => {
    if (userProfile.displayName) return userProfile.displayName;
    if (userProfile.firstName && userProfile.lastName) return `${userProfile.firstName} ${userProfile.lastName}`;
    if (userProfile.firstName) return userProfile.firstName;
    return userProfile.email.split('@')[0];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
        },
      }}
    >
      <DialogTitle>
        <Box>
          <Typography
            variant="h5"
            component="div"
            fontWeight={600}
          >
            Edit User Access
          </Typography>
          {user && (
            <Typography
              variant="body2"
              component="div"
              color="textSecondary"
              sx={{ mt: 1 }}
            >
              Managing access for: <strong>{getDisplayName(user)}</strong>
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>User Tier</InputLabel>
            <Select
              value={selectedTier}
              label="User Tier"
              onChange={(e) => setSelectedTier(e.target.value as 'basic' | 'premium' | 'editor' | 'admin')}
              disabled={false}
            >
              <MenuItem value="basic">
                <Box>
                  <Typography variant="body1">Basic</Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    Standard user access (no groups)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="premium">
                <Box>
                  <Typography variant="body1">Premium</Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    Enhanced features and functionality
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="editor">
                <Box>
                  <Typography variant="body1">Editor</Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    Content editing access + premium features
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="admin">
                <Box>
                  <Typography variant="body1">Admin</Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    Full system access + editor + premium features
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {selectedTier !== (user?.userTier || 'basic') && (
            <Alert
              severity="info"
              sx={{ mt: 2 }}
            >
              <Box>
                <Typography variant="body2">
                  This will change the user&apos;s access level from{' '}
                  <strong>
                    {(user?.userTier || 'basic').charAt(0).toUpperCase() + (user?.userTier || 'basic').slice(1)}
                  </strong>{' '}
                  to <strong>{selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}</strong>.
                </Typography>
                {selectedTier === 'admin' && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  >
                    ⚠️ Admin users will have full access to user management and system settings.
                  </Typography>
                )}
                {selectedTier === 'editor' && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Editor users will have content editing capabilities plus premium features.
                  </Typography>
                )}
              </Box>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={selectedTier === (user?.userTier || 'basic')}
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
