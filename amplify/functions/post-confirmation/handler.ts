import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { type Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/post-confirmation';
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log('🔐 PostConfirmation trigger started for user:', event.userName);
  console.log('🔄 Trigger source:', event.triggerSource);

  try {
    // Extract user attributes
    const { userAttributes } = event.request;
    const cognitoUserId = userAttributes.sub;
    const email = userAttributes.email;

    // Handle social login attributes (Google provides given_name, family_name)
    const firstName = userAttributes.given_name || userAttributes.givenName;
    const lastName = userAttributes.family_name || userAttributes.familyName;

    // Create display name fallback
    const displayName =
      firstName && lastName ? `${firstName} ${lastName}` : firstName || email?.split('@')[0] || 'User';

    console.log('📝 Creating user profile for:', email);

    // Check if user profile already exists (in case of account linking scenarios)
    const existingProfile = await client.models.UserProfile.get({ cognitoUserId });

    if (existingProfile.data) {
      // Update existing profile with any new information
      console.log('🔄 Updating existing user profile');
      await client.models.UserProfile.update({
        cognitoUserId,
        firstName: firstName || existingProfile.data.firstName,
        lastName: lastName || existingProfile.data.lastName,
        displayName: displayName || existingProfile.data.displayName,
        lastLoginAt: new Date().toISOString(),
        isActive: true,
      });
      console.log('✅ User profile updated successfully');
    } else {
      // Create new user profile
      console.log('🆕 Creating new user profile');
      await client.models.UserProfile.create({
        cognitoUserId,
        email,
        firstName,
        lastName,
        displayName,
        userTier: 'basic', // Default tier
        lastLoginAt: new Date().toISOString(),
        isActive: true,
      });
      console.log('✅ User profile created successfully');
    }
  } catch (error) {
    console.error('💥 Error in PostConfirmation trigger:', error);
    // Don't throw error - we don't want to block authentication
  }

  return event;
};
