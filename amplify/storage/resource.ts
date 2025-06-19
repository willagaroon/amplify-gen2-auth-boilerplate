import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'files',
  access: (allow) => ({
    'uploads/*': [allow.authenticated.to(['read', 'write']), allow.guest.to(['read'])],
    'public/*': [allow.authenticated.to(['read', 'write']), allow.guest.to(['read'])],
  }),
});
