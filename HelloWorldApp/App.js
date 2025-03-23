import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { BookProvider } from './src/context/BookContext';

export default function App() {
  return (
    <BookProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </BookProvider>
  );
} 