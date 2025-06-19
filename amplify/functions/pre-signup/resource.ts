import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'pre-signup',
  entry: './handler.ts',
  environment: {
    AMPLIFY_AUTH_USERPOOL_ID: process.env.AMPLIFY_AUTH_USERPOOL_ID || '',
  },
  runtime: 20,
  timeoutSeconds: 60,
});
