import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { SecureStorageTokenCache } from '~/utils/TokenCache';

const CLERK_PUBLISHABLE_KEY = Constants.expoConfig!.extra!.clerkPublishableKey;

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inTabsGroup = segments[0] === '(auth)';

    if (isSignedIn && !inTabsGroup) {
      console.debug('User has signed in, go to search');
      router.replace('/search');
    } else if (!isSignedIn) {
      console.debug('User has not signed in yet, go to login');
      router.replace('/login');
    }
  }, [isSignedIn]);
  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={SecureStorageTokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}
