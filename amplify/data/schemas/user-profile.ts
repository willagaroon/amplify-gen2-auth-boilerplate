import { a } from '@aws-amplify/backend';
import { userManagement } from '../../functions/user-management/resource';

// User Profile Types
export const userProfileTypes = {
  UserTier: a.enum(['basic', 'premium', 'editor', 'admin']),
};

// User Profile Models
export const userProfileModels = {
  UserProfile: a
    .model({
      // Cognito user ID - primary link to auth user
      cognitoUserId: a.id().required(),

      // Basic profile information
      email: a.email().required(),
      firstName: a.string(),
      lastName: a.string(),
      displayName: a.string(),
      avatar: a.url(),

      // User tier/group information
      userTier: a.ref('UserTier'),

      // Metadata
      lastLoginAt: a.datetime(),
      isActive: a.boolean().default(true),

      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      // Temporary: allow authenticated users full access for development (including tier updates)
      allow.authenticated().to(['create', 'read', 'update', 'delete']),

      // Users can read/update their own profile (redundant with above but keeping for clarity)
      allow.owner(),

      // TODO: Re-enable admin controls when admin users are created
      // allow.group('admin'),

      // TODO: Re-enable premium read access when needed
      // allow.group('premium').to(['read']),
    ])
    .identifier(['cognitoUserId']), // Use cognito user ID as the primary key
};

// User Profile Mutations
export const userProfileMutations = {
  // User Management Mutations (Temporary: allow authenticated users for development)
  updateUserTier: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      newTier: a.string().required(),
      currentTier: a.string(),
    })
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(userManagement))
    .returns(a.json()),
};
