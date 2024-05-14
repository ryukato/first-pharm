import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';

import { useWarmUpBrowser } from '~/hooks/useWarmUpBrowser';
import LoadingButton from './ui/LoadingButton';

WebBrowser.maybeCompleteAuthSession();

export type AuthProviderType = 'oauth_google' | 'oauth_apple' | 'oauth_facebook';

const SignInWithOAuth = ({ authType }: AuthProviderType) => {
  const [isLoading, setIsLoading] = useState(false);
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: authType });

  const onLoginButtonPress = useCallback(async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
        console.warn('something wrong!!');
      }
    } catch (error: any) {
      console.error('Fail to login', 'authType', authType, 'error', JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <LoadingButton
      title="Google Login"
      onPress={onLoginButtonPress}
      isLoading={isLoading}
      style={{ width: '100%' }}
      iconName="logo-google"
    />
  );
};

export default SignInWithOAuth;
