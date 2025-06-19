'use client';
import { useState } from 'react';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '@/app/components/shared/CustomTextField';
import CustomFormLabel from '@/app/components/shared/CustomFormLabel';
import CustomAlert from '@/app/components/shared/CustomAlert';

interface ForgotPasswordProps {
  title?: string;
  subtitle?: React.ReactNode;
  initialEmail?: string;
  mode?: 'forgot' | 'social'; // 'forgot' = standard forgot password, 'social' = create password for social account
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface PasswordValidation {
  length: boolean;
  hasContent: boolean;
}

export default function ForgotPassword({
  title,
  subtitle,
  initialEmail = '',
  mode = 'forgot',
  onSuccess,
  onCancel,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState(initialEmail);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Password validation logic
  const validatePassword = (pwd: string): PasswordValidation => ({
    length: pwd.length >= 12,
    hasContent: pwd.length > 0,
  });

  // Email validation
  const isValidEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const passwordValidation = validatePassword(newPassword);
  const isPasswordValid = passwordValidation.length && passwordValidation.hasContent;
  const isConfirmPasswordValid = confirmPassword === newPassword && confirmPassword.length > 0;
  // Simplified email validation - just check if it's a valid email format
  const isEmailValid = isValidEmail(email);
  const emailToUse = email.trim();

  // Mode-specific messaging
  const getContent = () => {
    if (mode === 'social') {
      return {
        title: title || 'Set Your Password',
        subtitle:
          subtitle ||
          'Set a password to use both social and email/password sign-in methods. We will send you a confirmation code.',
        confirmTitle: 'Set Your New Password',
        confirmSubtitle: `We sent a confirmation code to ${email}. Enter the code and set your new password below.`,
        buttonText: 'Send Setup Code',
        confirmButtonText: 'Set Password',
        alertTitle: 'Setup Failed',
        confirmAlertTitle: 'Password Setup Failed',
      };
    } else {
      return {
        title: title || 'Reset Your Password',
        subtitle:
          subtitle || 'Enter your email address and we will send you a confirmation code to reset your password.',
        confirmTitle: 'Enter New Password',
        confirmSubtitle: `We sent a confirmation code to ${email}. Enter the code and your new password below.`,
        buttonText: 'Send Reset Code',
        confirmButtonText: 'Reset Password',
        alertTitle: 'Reset Failed',
        confirmAlertTitle: 'Password Reset Failed',
      };
    }
  };

  const content = getContent();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Use the current email value, which should be valid if initialEmail was provided
    const emailToValidate = emailToUse;

    console.log('ForgotPassword - attempting reset for email:', emailToValidate);
    console.log('ForgotPassword - email validation result:', isEmailValid);
    console.log('ForgotPassword - initialEmail prop:', initialEmail);

    if (!emailToValidate || !isValidEmail(emailToValidate)) {
      console.log('ForgotPassword - email validation failed');
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('ForgotPassword - calling resetPassword with username:', emailToValidate);

      // Add timeout wrapper to detect hanging requests
      const resetPromise = resetPassword({ username: emailToValidate });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000),
      );

      await Promise.race([resetPromise, timeoutPromise]);
      console.log('ForgotPassword - resetPassword successful, moving to confirm step');
      setStep('confirm');
    } catch (err: any) {
      console.error('Reset password error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Full error object:', JSON.stringify(err, null, 2));

      let errorMessage = 'Failed to send reset email';

      if (err.message === 'Request timeout after 30 seconds') {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (err.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email address.';
      } else if (err.name === 'InvalidParameterException') {
        // Check if it's the unverified email issue
        if (err.message && err.message.includes('no registered/verified email')) {
          errorMessage =
            'Your email address is not verified. Please contact support or try signing in with Google if you used social login to create your account.';
        } else {
          errorMessage = 'Please check your email address and try again.';
        }
      } else if (err.name === 'TooManyRequestsException') {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (err.message) {
        // Check for the specific unverified email error in the message
        if (err.message.includes('no registered/verified email') || err.message.includes('phone_number')) {
          errorMessage =
            'Your email address is not verified. This can happen if you signed up with Google or if your account was not fully confirmed. Please try signing in with Google instead, or contact support for assistance.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      setError('Please fix the password validation errors below');
      setLoading(false);
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });

      onSuccess?.();
    } catch (err: any) {
      console.error('Confirm reset error:', err);
      let errorMessage = 'Failed to reset password';

      if (err.name === 'CodeMismatchException') {
        errorMessage = 'Invalid confirmation code. Please check your email and try again.';
      } else if (err.name === 'ExpiredCodeException') {
        errorMessage = 'Confirmation code has expired. Please request a new one.';
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements. Please ensure it is at least 12 characters long.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm') {
    return (
      <Box>
        <Typography
          fontWeight="700"
          variant="h2"
          mb={1}
        >
          {content.confirmTitle}
        </Typography>
        <Typography
          color="textSecondary"
          textAlign="center"
          variant="subtitle2"
          fontWeight="400"
          mb={3}
        >
          {content.confirmSubtitle}
        </Typography>

        {error && (
          <CustomAlert
            title={content.confirmAlertTitle}
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </CustomAlert>
        )}

        <Box
          component="form"
          onSubmit={handleConfirmReset}
        >
          <Stack spacing={3}>
            <Box>
              <CustomFormLabel htmlFor="confirmationCode">Confirmation Code</CustomFormLabel>
              <CustomTextField
                id="confirmationCode"
                variant="outlined"
                fullWidth
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
              />
            </Box>

            <Box>
              <CustomFormLabel htmlFor="newPassword">New Password</CustomFormLabel>
              <CustomTextField
                id="newPassword"
                type="password"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                error={passwordTouched && !isPasswordValid && newPassword.length > 0}
                required
              />

              {/* Password Requirements */}
              {(passwordTouched || newPassword.length > 0) && (
                <Box mt={1}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                  >
                    Password requirements:
                  </Typography>
                  <List
                    dense
                    sx={{ py: 0 }}
                  >
                    <ListItem sx={{ py: 0, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        {passwordValidation.length ? (
                          <CheckCircleIcon
                            color="success"
                            fontSize="small"
                          />
                        ) : (
                          <CancelIcon
                            color="error"
                            fontSize="small"
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="At least 12 characters long"
                        primaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </Box>

            <Box>
              <CustomFormLabel htmlFor="confirmPassword">Confirm New Password</CustomFormLabel>
              <CustomTextField
                id="confirmPassword"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                error={confirmPasswordTouched && !isConfirmPasswordValid && confirmPassword.length > 0}
                helperText={
                  confirmPasswordTouched && !isConfirmPasswordValid && confirmPassword.length > 0
                    ? 'Passwords do not match'
                    : ''
                }
                required
              />
            </Box>
          </Stack>

          <Stack
            spacing={2}
            mt={4}
          >
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={loading || !confirmationCode.trim() || !isPasswordValid || !isConfirmPasswordValid}
            >
              {loading ? <CircularProgress size={24} /> : content.confirmButtonText}
            </Button>
            <Button
              variant="text"
              size="medium"
              fullWidth
              onClick={onCancel}
              disabled={loading}
              sx={{ color: 'text.secondary' }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        fontWeight="700"
        variant="h2"
        mb={1}
      >
        {content.title}
      </Typography>

      <Typography
        color="textSecondary"
        textAlign="center"
        variant="subtitle2"
        fontWeight="400"
        mb={3}
      >
        {content.subtitle}
      </Typography>

      {error && (
        <CustomAlert
          title={content.alertTitle}
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </CustomAlert>
      )}

      <Box
        component="form"
        onSubmit={handleRequestReset}
      >
        <Stack spacing={3}>
          <Box>
            <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
            <CustomTextField
              id="email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!isEmailValid && email.length > 0}
              helperText={!isEmailValid && email.length > 0 ? 'Please enter a valid email address' : ''}
              required
            />
          </Box>
        </Stack>

        <Stack
          spacing={2}
          mt={4}
        >
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading || !isEmailValid}
          >
            {loading ? <CircularProgress size={24} /> : content.buttonText}
          </Button>
          <Button
            variant="text"
            size="medium"
            fullWidth
            onClick={onCancel}
            disabled={loading}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
