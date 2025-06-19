'use client';
import { useRouter, usePathname } from 'next/navigation';

const useSignIn = () => {
  const router = useRouter();
  const pathname = usePathname();

  const signIn = () => {
    // Store current location for redirect after login
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_redirect_after_login', pathname || '/');
    }
    router.push('/auth/signin');
  };

  return { signIn };
};

export default useSignIn;
