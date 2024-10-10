import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="c_home" />
        <Stack.Screen name="customer_dash" />
        <Stack.Screen name="seller-dashboard" />
      </Stack>
    </GestureHandlerRootView>
  );
}
