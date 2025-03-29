import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBook } from '../context/BookContext';
import { useStats } from '../context/StatsContext';
import { useJournal } from '../context/JournalContext';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  warningRed: '#E74C3C',
  coolGray: '#CED4DA'
};

const ResetButton = ({ onReset }) => {
  const { updateSelectedBook } = useBook();
  const { resetStats } = useStats();
  const { resetJournalEntries } = useJournal();

  // Direct reset handler without Alert
  const handleReset = async () => {
    console.log("RESET_DEBUG: Reset button clicked - executing direct reset");
    
    try {
      console.log("RESET_DEBUG: Starting AsyncStorage.clear()");
      // Clear AsyncStorage completely
      await AsyncStorage.clear();
      console.log("RESET_DEBUG: AsyncStorage cleared successfully");
      
      console.log("RESET_DEBUG: Updating book context");
      // Update contexts
      updateSelectedBook(null);
      console.log("RESET_DEBUG: Book context updated");
      
      console.log("RESET_DEBUG: Resetting stats context");
      resetStats();
      console.log("RESET_DEBUG: Stats context reset");
      
      console.log("RESET_DEBUG: Resetting journal entries");
      await resetJournalEntries();
      console.log("RESET_DEBUG: Journal entries reset");
      
      // Call onReset callback
      if (onReset) {
        console.log("RESET_DEBUG: Calling onReset callback");
        onReset();
        console.log("RESET_DEBUG: onReset callback completed");
      }
      
      console.log("RESET_DEBUG: Reset complete - showing success message");
      Alert.alert("Success", "All data has been reset successfully.");
    } catch (error) {
      console.error("RESET_DEBUG: Error during reset:", error);
      Alert.alert("Error", "Failed to reset data. Please try again.");
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleReset}
      activeOpacity={0.6}
    >
      <Text style={styles.buttonText}>Reset All Data</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: COLORS.coolGray,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.warningRed,
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default ResetButton; 