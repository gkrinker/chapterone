import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { BookProvider } from './src/context/BookContext';
import { JournalProvider } from './src/context/JournalContext';

export default function App() {
  return (
    <BookProvider>
      <JournalProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </JournalProvider>
    </BookProvider>
  );
} 