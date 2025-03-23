import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
 * Utility to completely reset all application data
 * Clears journal entries, book selection, reminders and resets all progress stats
 */
export const resetAppData = async () => {
  try {
    // Clear all app data from AsyncStorage
    const keysToReset = [
      'journalEntries',    // All journal entries
      'selectedBook',      // Selected book
      'promptSchedule',    // Reminder settings
      'growthScore',       // Any separately stored scores
      'streakCount'        // Any separately stored streak data
    ];
    
    // Create array of promises to clear all data keys
    const resetPromises = keysToReset.map(key => 
      AsyncStorage.removeItem(key)
    );
    
    // Set journalEntries to empty object rather than removing it
    // This ensures we have a valid empty state rather than undefined
    resetPromises.push(AsyncStorage.setItem('journalEntries', JSON.stringify({})));
    
    // Execute all reset operations
    await Promise.all(resetPromises);
    
    // Show success message
    Alert.alert(
      'Data Reset Complete',
      'All app data has been reset including:\n• Book selection\n• Journal entries\n• Growth score\n• Streak count\n• Reminder settings',
      [{ text: 'OK' }]
    );
    
    return true;
  } catch (error) {
    console.error('Failed to reset app data:', error);
    
    // Show error message
    Alert.alert(
      'Reset Failed',
      'An error occurred while resetting app data.',
      [{ text: 'OK' }]
    );
    
    return false;
  }
}; 