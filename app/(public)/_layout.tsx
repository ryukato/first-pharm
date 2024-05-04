import React from 'react';
import { Stack } from 'expo-router';

const PublicLayout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6c47ff',
        },
        headerTintColor: '#fff',
        headerBackTitle: 'Back',
      }}>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: 'Create Account',
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: 'Reset Password',
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
