import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { postConfirmation } from './functions/post-confirmation/resource.js';
import { postConfirmationPermissions } from './functions/post-confirmation/permissions.js';
import { preSignUp } from './functions/pre-signup/resource.js';
import { preSignUpPermissions } from './functions/pre-signup/permissions.js';
import { userManagement } from './functions/user-management/resource.js';

export const backend = defineBackend({
  auth,
  data,
  storage,
  postConfirmation,
  preSignUp,
  userManagement,
});

// Grant Cognito permissions to preSignUp function for account linking
backend.preSignUp.resources.lambda.addToRolePolicy(preSignUpPermissions.cognitoManageUsers);

// Grant Cognito permissions to postConfirmation function for email verification
backend.postConfirmation.resources.lambda.addToRolePolicy(postConfirmationPermissions.cognitoUpdateUser);

// Customize password policy for better UX while maintaining security
// Following modern NIST guidelines: length > complexity
const { cfnUserPool } = backend.auth.resources.cfnResources;

cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12, // Increased from 8 - length is more secure than complexity
    requireLowercase: false, // Removed complexity requirements for better UX
    requireNumbers: false, // Users can create longer, memorable passwords
    requireSymbols: false, // Without artificial constraints that lead to
    requireUppercase: false, // predictable patterns like "Password1!"
    temporaryPasswordValidityDays: 7, // Increased from 3 for better UX
  },
};
