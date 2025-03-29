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

const ResetDataButton = ({ onReset }) => {
  const { updateSelectedBook } = useBook();
  const { resetStats } = useStats();
  const { resetJournalEntries } = useJournal();

  const handleReset = async () => {
    // Ask for confirmation
    Alert.alert(
      "Reset All Data",
      "This will clear your selected book, all journal entries, and stats. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Starting data reset process...");
              
              // Reset all AsyncStorage data to ensure everything is cleared
              const keys = await AsyncStorage.getAllKeys();
              console.log("Found AsyncStorage keys:", keys);
              
              // Remove all relevant data
              await AsyncStorage.multiRemove([
                'selectedBook',
                'journalEntries',
                'userStats'
              ]);
              console.log("AsyncStorage data removed");
              
              // Reset book selection in context first
              console.log("Resetting selected book...");
              await updateSelectedBook(null);
              
              // Reset journal entries in context
              console.log("Resetting journal entries...");
              await resetJournalEntries();
              
              // Reset stats in context
              console.log("Resetting stats...");
              await resetStats();
              
              console.log("All contexts reset successfully");
              
              // Call the onReset callback if provided
              if (onReset) {
                console.log("Calling onReset callback...");
                onReset();
              }
              
              // Show success message
              Alert.alert("Reset Complete", "All data has been cleared successfully.");
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert("Error", "Failed to reset data. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleReset}>
      <Text style={styles.buttonText}>Reset All Data</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.coolGray,
  },
  buttonText: {
    color: COLORS.warningRed,
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default ResetDataButton; 