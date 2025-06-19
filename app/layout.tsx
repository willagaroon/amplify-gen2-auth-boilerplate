import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import './globals.css';
import ConfigureAmplifyClientSide from './components/shared/auth/ConfigureAmplify';
import { AuthProvider } from './components/shared/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'MyApp',
  description: 'My Amplify Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#121212', margin: 0, minHeight: '100vh' }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <ConfigureAmplifyClientSide>{children}</ConfigureAmplifyClientSide>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
