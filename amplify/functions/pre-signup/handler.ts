import type { PreSignUpTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminLinkProviderForUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { type Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/pre-signup';

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Initialize Amplify Data client for database operations
let dataClient: ReturnType<typeof generateClient<Schema>> | null = null;

async function initializeDataClient() {
  if (!dataClient) {
    try {
      const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
      Amplify.configure(resourceConfig, libraryOptions);
      dataClient = generateClient<Schema>();
      console.log('✅ Data client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize data client:', error);
      dataClient = null;
    }
  }
  return dataClient;
}

async function createUserProfile(cognitoUserId: string, email: string, firstName?: string, lastName?: string) {
  console.log('🗄️ Creating user profile in database...');

  const dbClient = await initializeDataClient();
  if (!dbClient) {
    console.error('❌ Data client not available, skipping database creation');
    return;
  }

  try {
    // Create display name fallback
    const displayName =
      firstName && lastName ? `${firstName} ${lastName}` : firstName || email?.split('@')[0] || 'User';

    console.log('📝 Creating user profile:', {
      cognitoUserId,
      email,
      firstName,
      lastName,
      displayName,
    });

    // Check if user profile already exists
    const existingProfile = await dbClient.models.UserProfile.get({ cognitoUserId });

    if (existingProfile.data) {
      console.log('🔄 Updating existing user profile');
      await dbClient.models.UserProfile.update({
        cognitoUserId,
        firstName: firstName || existingProfile.data.firstName,
        lastName: lastName || existingProfile.data.lastName,
        displayName: displayName || existingProfile.data.displayName,
        lastLoginAt: new Date().toISOString(),
        isActive: true,
      });
      console.log('✅ User profile updated successfully');
    } else {
      console.log('🆕 Creating new user profile');
      await dbClient.models.UserProfile.create({
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
    console.error('💥 Error creating user profile:', error);
    // Don't throw - we don't want to block authentication
  }
}

export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log('🚀 PreSignUp trigger started');
  console.log('👤 User:', event.userName);
  console.log('🔄 Trigger source:', event.triggerSource);
  console.log('📧 Email:', event.request.userAttributes.email);

  const { userPoolId } = event;
  const email = event.request.userAttributes.email;
  const triggerSource = event.triggerSource;

  if (!email) {
    console.log('❌ No email provided, allowing signup');
    return event;
  }

  // Only process OAuth external provider signups
  if (triggerSource !== 'PreSignUp_ExternalProvider') {
    console.log('⚡ Not an OAuth external provider signup, allowing to proceed');
    return event;
  }

  console.log('🌐 OAuth user signup detected');
  console.log('📧 Email verification handled by attribute mapping');

  try {
    // Check if there's already a user with this email
    console.log('🔍 Searching for existing users with email:', email);
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
      Limit: 10,
    });

    const existingUsers = await cognitoClient.send(listUsersCommand);
    console.log('📈 Found existing users:', existingUsers.Users?.length || 0);

    // Parse provider info from username (e.g., "Google_12345" -> ["Google", "12345"])
    const usernameParts = event.userName.split('_');
    if (usernameParts.length < 2) {
      console.error('❌ Invalid username format. Expected format: Provider_UserId, got:', event.userName);
      return event;
    }

    const [providerNameValue, providerUserId] = usernameParts;
    const providerName = providerNameValue.charAt(0).toUpperCase() + providerNameValue.slice(1);

    console.log('🏢 Provider:', providerName);

    let targetUsername: string;
    let finalCognitoUserId: string;

    if (existingUsers.Users && existingUsers.Users.length > 0) {
      // User already exists - link to existing user
      console.log('✅ User already exists - linking to existing user');

      // Sort by creation date to link to oldest user
      const sortedUsers = existingUsers.Users.sort((a, b) =>
        (a.UserCreateDate || 0) > (b.UserCreateDate || 0) ? 1 : -1,
      );
      targetUsername = sortedUsers[0].Username!;

      // For existing users, we need to get their actual Cognito User ID (sub)
      const existingUserAttributes = sortedUsers[0].Attributes || [];
      const subAttribute = existingUserAttributes.find((attr) => attr.Name === 'sub');
      finalCognitoUserId = subAttribute?.Value || targetUsername;

      console.log('🎯 Linking to existing user:', targetUsername);
    } else {
      // No existing user - create a Cognito user first, then link
      console.log('🆕 Creating new Cognito user');

      try {
        const createUserCommand = new AdminCreateUserCommand({
          UserPoolId: userPoolId,
          Username: email,
          MessageAction: 'SUPPRESS', // Don't send welcome email
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'given_name', Value: event.request.userAttributes.given_name || '' },
            { Name: 'family_name', Value: event.request.userAttributes.family_name || '' },
          ],
        });

        const createdUser = await cognitoClient.send(createUserCommand);
        targetUsername = createdUser.User!.Username!;

        // For new users, we need to extract the Cognito User ID from the created user
        const createdUserAttributes = createdUser.User!.Attributes || [];
        const subAttribute = createdUserAttributes.find((attr) => attr.Name === 'sub');
        finalCognitoUserId = subAttribute?.Value || targetUsername;

        console.log('✅ Successfully created user:', targetUsername);

        // Set a random password to change status from FORCE_CHANGE_PASSWORD to CONFIRMED
        const randomPassword = generateRandomPassword();

        const setPasswordCommand = new AdminSetUserPasswordCommand({
          UserPoolId: userPoolId,
          Username: targetUsername,
          Password: randomPassword,
          Permanent: true,
        });

        await cognitoClient.send(setPasswordCommand);
        console.log('✅ Successfully set password for user');
      } catch (createError: any) {
        if (createError.name === 'UsernameExistsException') {
          console.log('🔄 User was created by concurrent trigger, searching again...');

          // Another trigger already created the user, let's find it
          const retryListUsersCommand = new ListUsersCommand({
            UserPoolId: userPoolId,
            Filter: `email = "${email}"`,
            Limit: 10,
          });

          const retryExistingUsers = await cognitoClient.send(retryListUsersCommand);

          if (retryExistingUsers.Users && retryExistingUsers.Users.length > 0) {
            const sortedUsers = retryExistingUsers.Users.sort((a, b) =>
              (a.UserCreateDate || 0) > (b.UserCreateDate || 0) ? 1 : -1,
            );
            targetUsername = sortedUsers[0].Username!;

            const existingUserAttributes = sortedUsers[0].Attributes || [];
            const subAttribute = existingUserAttributes.find((attr) => attr.Name === 'sub');
            finalCognitoUserId = subAttribute?.Value || targetUsername;

            console.log('🎯 Found user created by concurrent trigger:', targetUsername);
          } else {
            console.error('❌ Could not find user even after UsernameExistsException');
            throw createError;
          }
        } else {
          throw createError;
        }
      }
    }

    // Link the external provider to the target user
    console.log('🔗 Linking provider to user...');

    try {
      const linkCommand = new AdminLinkProviderForUserCommand({
        UserPoolId: userPoolId,
        DestinationUser: {
          ProviderName: 'Cognito',
          ProviderAttributeValue: targetUsername,
        },
        SourceUser: {
          ProviderName: providerName,
          ProviderAttributeName: 'Cognito_Subject',
          ProviderAttributeValue: providerUserId,
        },
      });

      await cognitoClient.send(linkCommand);
      console.log('🎉 Successfully linked provider to user');
    } catch (linkError: any) {
      if (linkError.message && linkError.message.includes('already linked')) {
        console.log('ℹ️  Accounts already linked, proceeding');
      } else {
        console.error('💥 Link error:', linkError);
        throw linkError;
      }
    }

    // Create database record since PostConfirmation won't run due to OAuth auto-confirmation
    console.log('🗄️ Creating database record...');
    await createUserProfile(
      finalCognitoUserId,
      email,
      event.request.userAttributes.given_name,
      event.request.userAttributes.family_name,
    );

    // Let Cognito handle user confirmation and email verification via attribute mapping
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;

    console.log('✅ PreSignUp completed successfully');
    return event;
  } catch (error) {
    console.error('💥 Error in PreSignUp trigger:', error);

    // If linking fails due to already being linked, that's OK
    if (error instanceof Error && error.message.includes('already linked')) {
      console.log('ℹ️  Accounts already linked, proceeding');
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
      return event;
    }

    // For other errors, let signup continue but log the issue
    console.error('⚠️  Unexpected error, allowing signup to continue');
    return event;
  }
};

function generateRandomPassword(): string {
  // Generate a random password that meets Cognito requirements
  const randomPart1 = Math.random().toString(36).slice(-8);
  const randomPart2 = Math.random().toString(36).slice(-8);
  const password = `${randomPart1}${randomPart2}A1!@#$`;
  return password;
}
