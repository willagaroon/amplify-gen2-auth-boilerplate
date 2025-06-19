'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'aws-amplify/auth';
import { Box, Typography, Button, Stack, CircularProgress, FormControlLabel, Checkbox, Divider } from '@mui/material';
import CustomTextField from '@/app/components/shared/CustomTextField';
import CustomFormLabel from '@/app/components/shared/CustomFormLabel';
import CustomAlert from '@/app/components/shared/CustomAlert';
import SocialLoginButtons from './SocialLoginButtons';
import ForgotPassword from './ForgotPassword';
import { SUPPORTED_SOCIAL_PROVIDERS, formatProvidersText } from '@/app/constants/auth';

interface CustomAuthLoginProps {
  title?: string;
  subtitle?: React.ReactNode;
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export default function CustomAuthLogin({
  title = 'Welcome Back',
  subtitle,
  onSuccess,
  onSwitchToSignUp,
  onSwitchToForgotPassword,
}: CustomAuthLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Email validation
  const isValidEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const isEmailValid = isValidEmail(email);
  const isFormValid = isEmailValid && password.length > 0;

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('myapp_last_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true); // If email was saved, checkbox should be checked
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!isFormValid) {
      setError('Please enter a valid email and password');
      setLoading(false);
      return;
    }

    try {
      await signIn({ username: email, password });
      // Save email for future logins if checkbox is checked
      if (rememberEmail) {
        localStorage.setItem('myapp_last_email', email);
      } else {
        localStorage.removeItem('myapp_last_email');
      }

      // Let the parent page handle the redirect via useEffect
      onSuccess?.();
    } catch (err: any) {
      console.error('Sign in error:', err);
      let errorMessage = 'Failed to sign in';

      // Provide more helpful error messages
      if (err.name === 'NotAuthorizedException') {
        const providersText = formatProvidersText(SUPPORTED_SOCIAL_PROVIDERS);

        errorMessage = `Incorrect email or password. You may have signed up with ${providersText} (try the social sign-in below), or you might need to reset your password.`;
      } else if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      } else if (err.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email address. Please create an account first.';
      } else if (err.name === 'TooManyRequestsException') {
        errorMessage = 'Too many failed attempts. Please wait a moment and try again.';
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

  if (showForgotPassword) {
    return (
      <ForgotPassword
        mode="forgot"
        initialEmail={email}
        onSuccess={() => {
          setShowForgotPassword(false);
          setError('');
          // Show success message or redirect
          onSuccess?.();
        }}
        onCancel={() => {
          setShowForgotPassword(false);
          setError('');
        }}
      />
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
          title="Sign In Failed"
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </CustomAlert>
      )}

      <SocialLoginButtons title="Sign in with" />

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
            or sign in with
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
            required
          />
        </Box>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        my={2}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
              color="primary"
            />
          }
          label="Remember me"
          sx={{ m: 0 }}
        />
        <Typography
          component="button"
          type="button"
          onClick={() => {
            if (onSwitchToForgotPassword) {
              onSwitchToForgotPassword();
            } else {
              setShowForgotPassword(true);
            }
          }}
          variant="subtitle2"
          fontWeight="500"
          sx={{
            background: 'none',
            border: 'none',
            textDecoration: 'none',
            color: 'primary.main',
            cursor: 'pointer',
          }}
        >
          Forgot Password?
        </Typography>
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
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Box>

      {onSwitchToSignUp && (
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
            New user?
          </Typography>
          <Typography
            component="button"
            type="button"
            onClick={onSwitchToSignUp}
            fontWeight="500"
            sx={{
              background: 'none',
              border: 'none',
              textDecoration: 'none',
              color: 'primary.main',
              cursor: 'pointer',
            }}
          >
            Create an account
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
