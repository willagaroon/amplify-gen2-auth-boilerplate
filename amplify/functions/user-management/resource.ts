import { defineFunction } from '@aws-amplify/backend';

export const userManagement = defineFunction({
  name: 'user-management',
  entry: './handler.ts',
  resourceGroupName: 'auth',
});
