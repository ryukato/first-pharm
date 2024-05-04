import { useSignIn, useSession } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Text, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const PasswordReset: React.FC = () => {
  const { session, isSignedIn } = useSession();
  const { signIn, setActive } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [successulCreation, setSuccessfulCreation] = useState(false);
  const [code, setCode] = useState('');
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

  const onRequestReset = async () => {
    setLoading(true);

    try {
      await signIn!.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (error: any) {
      console.log('Fail to send password reset email, error', JSON.stringify(error));
      alert('Fail to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    setLoading(true);

    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      console.log(result);
      alert('Password reset successfully');

      await setActive!({
        session: result.createdSessionId,
      });
    } catch (error: any) {
      console.log('Fail to set new password, error', JSON.stringify(error));
      alert('Fail to set new password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successulCreation }} />
      <Spinner visible={loading} />
      {!successulCreation && (
        <>
          <TextInput
            style={styles.inputText}
            autoCapitalize="none"
            placeholder="email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
          <Button title="Send Reset Email" color="#6c47ff" onPress={onRequestReset} />
        </>
      )}
      {successulCreation && (
        <>
          <View>
            <TextInput
              style={styles.inputText}
              placeholder="Code"
              value={code}
              onChangeText={setCode}
            />
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="New password"
              value={password}
              onChangeText={setPassword}
            />

            <Button title="Set new password" color="#6c47ff" onPress={onReset} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
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
export default PasswordReset;
