import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      router.replace('/search');
    } else if (!isSignedIn) {
      router.replace('/login');
    }
  }, [isSignedIn]);
  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={SecureStorageTokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
