import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack } from 'expo-router';
import React from 'react';

const AuthLayout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerRight: ({ color }) => (
          <Link href="/profile">
            <Ionicons name="person-circle" size={28} color={color} />
          </Link>
        ),
      }}>
      <Stack.Screen
        name="search"
        options={{
          headerTitle: 'Search',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: 'Profile',
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          headerTitle: 'Barcode Scan',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
