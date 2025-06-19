import { defineAuth, secret } from '@aws-amplify/backend';
import { postConfirmation } from '../functions/post-confirmation/resource';
import { preSignUp } from '../functions/pre-signup/resource';
import { userManagement } from '../functions/user-management/resource';

/**
 * Define and configure your auth resource
 * User Groups (cumulative access):
 * - basic: Free tier users with limited access (no groups)
 * - premium: Paid users with enhanced features
 * - editor: Content editing capabilities (requires premium)
 * - admin: Full system access including user management (requires premium + editor)
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

// Check if Google OAuth secrets are available
const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Base auth configuration
export const auth = defineAuth({
  loginWith: {
    email: true,
    ...(hasGoogleOAuth && {
      externalProviders: {
        google: {
          clientId: secret('GOOGLE_CLIENT_ID'),
          clientSecret: secret('GOOGLE_CLIENT_SECRET'),
          scopes: ['email', 'profile', 'openid'],
          attributeMapping: {
            givenName: 'given_name',
            familyName: 'family_name',
            emailVerified: 'email_verified',
          },
        },
        callbackUrls: [
          'http://localhost:3000/auth/callback',
          // Add your production domain here when deploying
          // 'https://yourdomain.com/auth/callback'
        ],
        logoutUrls: [
          'http://localhost:3000/',
          // Add your production domain here when deploying
          // 'https://yourdomain.com/'
        ],
      },
    }),
  },
  groups: ['premium', 'editor', 'admin'],
  triggers: {
    preSignUp,
    postConfirmation,
  },
  access: (allow) => [allow.resource(userManagement).to(['manageGroupMembership', 'listGroupsForUser'])],
});
