import React, { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Button, View } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '~/hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onLoginButtonPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (error: any) {
      console.error('Fail to google login, error', JSON.stringify(error));
    }
  }, []);

  return (
    <View>
      <Button title="Sign in with Google" onPress={onLoginButtonPress} />
    </View>
  );
};

export default SignInWithOAuth;
