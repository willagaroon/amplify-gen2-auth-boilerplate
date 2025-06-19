import type { Schema } from '../../data/resource';
import { env } from '$amplify/env/user-management';
import {
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

// Type for the mutations
type UpdateUserTierHandler = Schema['updateUserTier']['functionHandler'];

// Define what groups each tier should have (cumulative)
const getTierGroups = (tier: string): string[] => {
  switch (tier) {
    case 'basic':
      return [];
    case 'premium':
      return ['premium'];
    case 'editor':
      return ['premium', 'editor'];
    case 'admin':
      return ['premium', 'editor', 'admin'];
    default:
      return [];
  }
};

export const handler: UpdateUserTierHandler = async (event) => {
  console.log('User management handler started:', event.arguments);

  const { userId, newTier, currentTier } = event.arguments;

  try {
    // Get current groups the user is in
    const listGroupsCommand = new AdminListGroupsForUserCommand({
      UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
      Username: userId,
    });

    const currentGroupsResponse = await client.send(listGroupsCommand);
    const currentGroups =
      (currentGroupsResponse.Groups?.map((group) => group.GroupName).filter(Boolean) as string[]) || [];

    // Determine what groups the user should have
    const targetGroups = getTierGroups(newTier);

    console.log(`Current groups: ${currentGroups.join(', ')}`);
    console.log(`Target groups: ${targetGroups.join(', ')}`);

    // Remove user from groups they shouldn't have
    const groupsToRemove = currentGroups.filter((group) => !targetGroups.includes(group));
    for (const groupName of groupsToRemove) {
      const removeCommand = new AdminRemoveUserFromGroupCommand({
        UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
        Username: userId,
        GroupName: groupName,
      });

      await client.send(removeCommand);
      console.log(`Removed user ${userId} from group ${groupName}`);
    }

    // Add user to groups they should have but don't
    const groupsToAdd = targetGroups.filter((group) => !currentGroups.includes(group));
    for (const groupName of groupsToAdd) {
      const addCommand = new AdminAddUserToGroupCommand({
        UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
        Username: userId,
        GroupName: groupName,
      });

      await client.send(addCommand);
      console.log(`Added user ${userId} to group ${groupName}`);
    }

    return {
      success: true,
      message: `User tier updated from ${currentTier || 'basic'} to ${newTier}. Groups: [${targetGroups.join(', ')}]`,
    };
  } catch (error) {
    console.error('Error updating user tier:', error);
    return {
      success: false,
      message: `Failed to update user tier: ${error}`,
    };
  }
};
