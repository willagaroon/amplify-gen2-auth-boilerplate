'use client';

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';

// Configure Amplify
Amplify.configure(outputs);

export default function ConfigureAmplifyClientSide({ children }: { children: React.ReactNode }) {
  // Just show children without any auth checking for now
  return <div>{children}</div>;
}
