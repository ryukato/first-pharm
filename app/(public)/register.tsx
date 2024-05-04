import { useSignUp } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Text, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import emailValidate from 'react-native-email-validator';

const Register: React.FC = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    if (!emailValidate(emailAddress)) {
      alert('Invalid email address');
      return;
    }
    if (password === '') {
      alert('Enter password!');
      return;
    }
    setLoading(true);

    try {
      // create the user account
      await signUp.create({
        emailAddress,
        password,
      });

      // Send email verifiication
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (error: any) {
      console.error('Fail to sign-up, error', error.message);
      alert('Fail to sign-up');
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: completeSignUp.createdSessionId });
    } catch (error: any) {
      console.error('Fail to verify code, error', error.message);
      alert('Fail to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
          <TextInput
            style={styles.inputText}
            autoCapitalize="none"
            placeholder="email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="password"
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Sign Up" color="#6c47ff" onPress={onSignUpPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <View>
            <TextInput
              style={styles.inputText}
              placeholder="code"
              value={code}
              onChangeText={setCode}
            />
          </View>
          <Button title="Verify Email" color="#6c47ff" onPress={onPressVerify} />
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
export default Register;
