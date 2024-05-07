import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout: React.FC = () => {
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
        name="home"
        options={{
          headerTitle: 'Home',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
