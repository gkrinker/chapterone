import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const JournalContext = createContext();

// Create provider component
export const JournalProvider = ({ children }) => {
  const [journalEntries, setJournalEntries] = useState({});
  const [loading, setLoading] = useState(true);

  // Load saved entries on initial render
  useEffect(() => {
    const loadStoredEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem('journalEntries');
        if (storedEntries) {
          setJournalEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.error('Failed to load journal entries from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredEntries();
  }, []);

  // Save a new journal entry
  const saveJournalEntry = async (date, entry) => {
    try {
      const updatedEntries = {
        ...journalEntries,
        [date]: entry
      };
      
      setJournalEntries(updatedEntries);
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      return true;
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      return false;
    }
  };

  // Get a journal entry by date
  const getJournalEntry = (date) => {
    return journalEntries[date] || null;
  };

  // Get all journal entries
  const getAllJournalEntries = () => {
    return journalEntries;
  };

  // Delete a journal entry
  const deleteJournalEntry = async (date) => {
    try {
      const updatedEntries = { ...journalEntries };
      delete updatedEntries[date];
      
      setJournalEntries(updatedEntries);
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      return true;
    } catch (error) {
      console.error('Failed to delete journal entry:', error);
      return false;
    }
  };

  // Reset all journal entries (for data reset)
  const resetJournalEntries = async () => {
    try {
      console.log("JournalContext: Removing journal entries from AsyncStorage...");
      await AsyncStorage.removeItem('journalEntries');
      
      console.log("JournalContext: Clearing entries from state...");
      setJournalEntries({});
      
      console.log("JournalContext: Journal entries reset complete");
      return true;
    } catch (error) {
      console.error('Failed to reset journal entries:', error);
      return false;
    }
  };

  // Provide context value to children
  return (
    <JournalContext.Provider 
      value={{ 
        journalEntries,
        saveJournalEntry,
        getJournalEntry,
        getAllJournalEntries,
        deleteJournalEntry,
        resetJournalEntries,
        loading 
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

// Custom hook to use the context
export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export default JournalContext; 