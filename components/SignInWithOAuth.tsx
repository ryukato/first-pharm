import { useOAuth } from '@clerk/clerk-expo';
import { Button } from '@rneui/base';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';

import { useWarmUpBrowser } from '~/hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

export type AuthProviderType = 'oauth_google' | 'oauth_apple' | 'oauth_facebook';

const SignInWithOAuth = ({ authType }: AuthProviderType) => {
  const resolvAuthButtonTitle = (type: string) => {
    if (type === 'oauth_google') {
      return {
        title: 'Google Login',
      };
    } else if (type === 'oauth_apple') {
      return {
        title: 'Apple Login',
      };
    } else if (type === 'oauth_facebook') {
      return {
        title: 'Facebook Login',
      };
    } else {
      return {
        title: 'Google Login',
      };
    }
  };

  const resolveAuthButtonIcon = (type: string) => {
    if (type === 'oauth_google') {
      return {
        name: 'google',
        type: 'font-awesome',
        size: 15,
        color: 'white',
      };
    } else if (type === 'oauth_apple') {
      return {
        name: 'apple',
        type: 'font-awesome',
        size: 15,
        color: 'white',
      };
    } else if (type === 'oauth_facebook') {
      return {
        name: 'facebook',
        type: 'font-awesome',
        size: 15,
        color: 'white',
      };
    } else {
      return {
        name: 'google',
        type: 'font-awesome',
        size: 15,
        color: 'white',
      };
    }
  };

  const authInfo = resolvAuthButtonTitle(authType);
  const buttonIcon = resolveAuthButtonIcon(authType);
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: authType });

  const onLoginButtonPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
        console.warn('something wrong!!');
      }
    } catch (error: any) {
      console.error('Fail to login', 'authType', authType, 'error', JSON.stringify(error));
    }
  }, []);

  return (
    <Button
      onPress={onLoginButtonPress}
      title={authInfo.title}
      iconContainerStyle={{ marginRight: 10 }}
      titleStyle={{ fontWeight: '700' }}
      icon={buttonIcon}
      buttonStyle={{
        backgroundColor: 'rgba(90, 154, 230, 1)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
      }}
      containerStyle={{
        width: '100%',
        marginBottom: 10,
      }}
    />
  );
};

export default SignInWithOAuth;
