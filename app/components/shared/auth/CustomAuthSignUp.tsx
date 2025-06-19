'use client';
import { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
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
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomTextField from '@/app/components/shared/CustomTextField';
import CustomFormLabel from '@/app/components/shared/CustomFormLabel';
import CustomAlert from '@/app/components/shared/CustomAlert';
import SocialLoginButtons from './SocialLoginButtons';
import ForgotPassword from './ForgotPassword';
import { SUPPORTED_SOCIAL_PROVIDERS, formatProvidersText } from '@/app/constants/auth';

interface CustomAuthSignUpProps {
  title?: string;
  subtitle?: React.ReactNode;
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

interface PasswordValidation {
  length: boolean;
  hasContent: boolean;
}

export default function CustomAuthSignUp({
  title = 'Create Account',
  subtitle,
  onSuccess,
  onSwitchToSignIn,
}: CustomAuthSignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showForgotPasswordOption, setShowForgotPasswordOption] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState<'forgot' | 'social'>('forgot');

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

  const passwordValidation = validatePassword(password);
  const isPasswordValid = passwordValidation.length && passwordValidation.hasContent;
  const isConfirmPasswordValid = confirmPassword === password && confirmPassword.length > 0;
  const isEmailValid = isValidEmail(email);
  const isFormValid = isEmailValid && isPasswordValid && isConfirmPasswordValid;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Final validation
    if (!isFormValid) {
      setError('Please fix the validation errors below');
      setLoading(false);
      return;
    }

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      setNeedsConfirmation(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      let errorMessage = 'Failed to create account';

      // Provide more helpful error messages
      if (err.name === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists.';
        setShowForgotPasswordOption(true);
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = "Password does not meet requirements. Please ensure it's at least 12 characters long.";
      } else if (err.name === 'InvalidParameterException') {
        errorMessage = 'Please check your email address and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });

      // User profile will be created automatically by the PostConfirmation trigger

      // Automatically sign the user in after successful verification
      const { signIn } = await import('aws-amplify/auth');
      await signIn({
        username: email,
        password: password,
      });

      onSuccess?.();
    } catch (err: any) {
      console.error('Confirmation error:', err);
      let errorMessage = 'Failed to confirm account';

      if (err.name === 'CodeMismatchException') {
        errorMessage = 'Invalid confirmation code. Please check your email and try again.';
      } else if (err.name === 'ExpiredCodeException') {
        errorMessage = 'Confirmation code has expired. Please request a new one.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        mode={forgotPasswordMode}
        initialEmail={email}
        onSuccess={() => {
          setShowForgotPassword(false);
          setShowForgotPasswordOption(false);
          setError('');
          // Show success message or redirect
          onSuccess?.();
        }}
        onCancel={() => {
          setShowForgotPassword(false);
          setShowForgotPasswordOption(false);
          setError('');
        }}
      />
    );
  }

  if (needsConfirmation) {
    return (
      <Box
        component="form"
        onSubmit={handleConfirmSignUp}
      >
        <Typography
          fontWeight="700"
          variant="h3"
          mb={1}
        >
          Confirm Your Email
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          mb={3}
        >
          We sent a confirmation code to <strong>{email}</strong>. Check your email and enter the code below.
        </Typography>

        {error && (
          <CustomAlert
            title="Email Confirmation Failed"
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </CustomAlert>
        )}

        <Box mb={3}>
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

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading || !confirmationCode.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirm Account'}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSignUp}
    >
      {title && (
        <Typography
          fontWeight="700"
          variant="h3"
          mb={1}
        >
          {title}
        </Typography>
      )}

      {subtitle}

      {error && (
        <CustomAlert
          title="Account Creation Failed"
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
          {showForgotPasswordOption && (
            <Stack
              direction="row"
              spacing={2}
              mt={2}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  onSwitchToSignIn?.();
                }}
              >
                Sign In Instead
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setForgotPasswordMode('forgot');
                  setShowForgotPassword(true);
                }}
              >
                Forgot Password
              </Button>
            </Stack>
          )}
        </CustomAlert>
      )}

      {showForgotPasswordOption && (
        <>
          {/* Explanation text */}
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2, mb: 2, display: 'block' }}
          >
            You may have signed up with {formatProvidersText(SUPPORTED_SOCIAL_PROVIDERS)}, if so use the buttons below
            to sign in with that provider.
          </Typography>

          {/* Secondary option for dual auth */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Want to use both social and password sign-in?{' '}
            <Typography
              component="button"
              type="button"
              variant="caption"
              onClick={() => {
                setForgotPasswordMode('social');
                setShowForgotPassword(true);
              }}
              sx={{
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                color: 'primary.main',
                cursor: 'pointer',
                p: 0,
              }}
            >
              Create a password for your existing account
            </Typography>{' '}
            to enable both sign-in methods.
          </Typography>
        </>
      )}

      <SocialLoginButtons title="Sign up with" />

      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box>

      <Stack
        spacing={2}
        mt={3}
      >
        <Box>
          <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
          <CustomTextField
            id="email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            error={emailTouched && !isValidEmail(email) && email.length > 0}
            helperText={
              emailTouched && !isValidEmail(email) && email.length > 0 ? 'Please enter a valid email address' : ''
            }
            required
          />
        </Box>

        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            error={passwordTouched && !isPasswordValid && password.length > 0}
            required
          />

          {/* Password Requirements */}
          {(passwordTouched || password.length > 0) && (
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
          <CustomFormLabel htmlFor="confirmPassword">Confirm Password</CustomFormLabel>
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

      <Box mt={3}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading || !isFormValid}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Account'}
        </Button>
      </Box>

      {onSwitchToSignIn && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          mt={3}
        >
          <Typography
            color="textSecondary"
            variant="h6"
            fontWeight="500"
          >
            Already have an account?
          </Typography>
          <Typography
            component="button"
            type="button"
            onClick={onSwitchToSignIn}
            fontWeight="500"
            sx={{
              background: 'none',
              border: 'none',
              textDecoration: 'none',
              color: 'primary.main',
              cursor: 'pointer',
            }}
          >
            Sign in
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
