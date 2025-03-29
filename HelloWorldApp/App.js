import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import Toast from 'react-native-toast-message'; // Removed

import AppNavigator from './src/navigation/AppNavigator';
import { BookProvider } from './src/context/BookContext';
import { JournalProvider } from './src/context/JournalContext';
import { StatsProvider } from './src/context/StatsContext';

export default function App() {
  return (
    <>
      <BookProvider>
        <JournalProvider>
          <StatsProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </StatsProvider>
        </JournalProvider>
      </BookProvider>
      {/* <Toast /> */}
    </>
  );
} 