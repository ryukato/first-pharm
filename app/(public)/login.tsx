import { useSession, useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from '~/components/Button';
import SignInWithOAuth from '~/components/SignInWithOAuth';

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
      <Spinner visible={loading} />

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

      <Button onPress={onSignInPress} title="Login" color="#6c47ff" />
      <SignInWithOAuth />
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
