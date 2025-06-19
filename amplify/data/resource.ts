import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { userProfileTypes, userProfileModels, userProfileMutations } from './schemas/user-profile';
import { postConfirmation } from '../functions/post-confirmation/resource';
import { preSignUp } from '../functions/pre-signup/resource';

const schema = a
  .schema({
    // Import User Profile Types
    ...userProfileTypes,
    // Import User Profile Models
    ...userProfileModels,
    // Import User Profile Mutations
    ...userProfileMutations,
  })
  .authorization((allow) => [allow.resource(postConfirmation), allow.resource(preSignUp)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
