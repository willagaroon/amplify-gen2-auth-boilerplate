// Supported social authentication providers
// This will be populated dynamically based on backend configuration
// Add new providers here when you configure them in amplify/auth/resource.ts
export const SUPPORTED_SOCIAL_PROVIDERS: string[] = [
  // 'Google', // Uncomment when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured
];

// Helper function to format provider list for error messages
export const formatProvidersText = (providers: string[]): string => {
  if (providers.length === 0) {
    return 'social login';
  }

  if (providers.length === 1) {
    return providers[0];
  }

  if (providers.length === 2) {
    return `${providers[0]} or ${providers[1]}`;
  }

  return providers.slice(0, -1).join(', ') + ', or ' + providers.slice(-1);
};
