import { useSession, useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import SignInWithOAuth from '~/components/SignInWithOAuth';
import LoadingButton from '~/components/ui/LoadingButton';

const Login: React.FC = () => {
  const { session } = useSession();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  useMemo(() => {
    const invalidateSesson = async () => {
      console.log('session', session);
      if (session && session.status === 'active') {
        await session!.remove();
      }
    };
    invalidateSesson();
  }, []);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignin = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignin.createdSessionId });
    } catch (error: any) {
      console.error('Fail to do signin, error', error);
      alert('Fail to do signin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SignInWithOAuth authType="oauth_google" />
      {/* <SignInWithOAuth authType="oauth_apple" /> */}
      {/* <SignInWithOAuth authType="oauth_facebook" /> */}
      <View
        style={{
          marginVertical: 10,
          alignContent: 'space-around',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          style={styles.inputField}
          autoCapitalize="none"
          placeholder="email address"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        <TextInput
          secureTextEntry
          style={styles.inputField}
          autoCapitalize="none"
          placeholder="password"
          value={password}
          onChangeText={setPassword}
        />

        <LoadingButton
          title="Login"
          onPress={onSignInPress}
          isLoading={loading}
          style={{ width: '100%' }}
          iconName="log-in-outline"
        />
      </View>
      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
});

export default Login;
