import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const cognitoManageUsersPermissions = new PolicyStatement({
  actions: [
    'cognito-idp:ListUsers',
    'cognito-idp:AdminLinkProviderForUser',
    'cognito-idp:AdminSetUserPassword',
    'cognito-idp:AdminGetUser',
    'cognito-idp:AdminCreateUser',
    'cognito-idp:AdminUpdateUserAttributes',
  ],
  resources: ['*'],
});

// Export for use in backend.ts
export const preSignUpPermissions = {
  cognitoManageUsers: cognitoManageUsersPermissions,
};
