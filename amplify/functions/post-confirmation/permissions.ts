import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const cognitoUpdateUserPermissions = new PolicyStatement({
  actions: ['cognito-idp:AdminUpdateUserAttributes'],
  resources: ['*'],
});

// Export for use in backend.ts
export const postConfirmationPermissions = {
  cognitoUpdateUser: cognitoUpdateUserPermissions,
};
