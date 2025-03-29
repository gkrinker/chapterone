import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJournal } from './JournalContext';

// Create context
const StatsContext = createContext();

// Points per character range
const MIN_POINTS_PER_CHAR = 7;
const MAX_POINTS_PER_CHAR = 13;

// Create provider component
export const StatsProvider = ({ children }) => {
  const [growthScore, setGrowthScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastEntryDate, setLastEntryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { journalEntries, loading: journalLoading } = useJournal();
  
  // Load stored stats on initial render
  useEffect(() => {
    const loadStoredStats = async () => {
      try {
        const storedStats = await AsyncStorage.getItem('userStats');
        if (storedStats) {
          const { growthScore, streak, lastEntryDate } = JSON.parse(storedStats);
          setGrowthScore(growthScore || 0);
          setStreak(streak || 0);
          setLastEntryDate(lastEntryDate || null);
        }
      } catch (error) {
        console.error('Failed to load stats from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredStats();
  }, []);
  
  // Calculate streak based on journal entries
  useEffect(() => {
    if (journalLoading || loading || !journalEntries) return;
    
    const calculateStreak = () => {
      // Get dates in descending order (newest first)
      const dates = Object.keys(journalEntries).sort().reverse();
      
      if (dates.length === 0) {
        return 0;
      }
      
      let currentStreak = 0;
      
      // Check consecutive days starting from most recent
      for (const date of dates) {
        if (journalEntries[date] && journalEntries[date].text) {
          currentStreak++;
        } else {
          break; // Break on first gap
        }
      }
      
      return currentStreak;
    };
    
    // Only update if calculated streak is different from current
    const calculatedStreak = calculateStreak();
    if (calculatedStreak !== streak) {
      setStreak(calculatedStreak);
      
      // Update last entry date
      const dates = Object.keys(journalEntries).sort().reverse();
      if (dates.length > 0) {
        setLastEntryDate(dates[0]);
      }
      
      // Save to storage
      saveStats(growthScore, calculatedStreak, dates[0] || null);
    }
  }, [journalEntries, journalLoading, loading, streak, growthScore]);
  
  // Save stats to AsyncStorage
  const saveStats = async (score, currentStreak, entryDate) => {
    try {
      await AsyncStorage.setItem('userStats', JSON.stringify({
        growthScore: score,
        streak: currentStreak,
        lastEntryDate: entryDate
      }));
    } catch (error) {
      console.error('Failed to save stats to storage:', error);
    }
  };

  // Update growth score when a new entry is submitted
  const updateGrowthScore = (points, entry) => {
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Only update if this is a new entry for today (not an edit)
    if (today !== lastEntryDate) {
      let pointsToAdd = points;
      
      // If an entry object is provided, calculate points based on length
      if (entry && entry.text) {
        const entryLength = entry.text.trim().length;
        const pointsPerChar = Math.floor(Math.random() * 
          (MAX_POINTS_PER_CHAR - MIN_POINTS_PER_CHAR + 1)) + MIN_POINTS_PER_CHAR;
        pointsToAdd = Math.max(points, entryLength * pointsPerChar);
      }
      
      // Update growth score with the specified points
      const newScore = growthScore + pointsToAdd;
      setGrowthScore(newScore);
      
      // Update last entry date
      setLastEntryDate(today);
      
      // Update streak (incremented by 1 for today)
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Save to storage
      saveStats(newScore, newStreak, today);
      
      // Return the points earned for animations
      return pointsToAdd;
    }
    
    return 0; // No points earned for edits
  };
  
  // Reset all stats
  const resetStats = async () => {
    try {
      console.log("StatsContext: Removing stats from AsyncStorage...");
      await AsyncStorage.removeItem('userStats');
      
      console.log("StatsContext: Resetting growth score to 0...");
      setGrowthScore(0);
      
      console.log("StatsContext: Resetting streak to 0...");
      setStreak(0);
      
      console.log("StatsContext: Resetting last entry date to null...");
      setLastEntryDate(null);
      
      console.log("StatsContext: Stats reset complete");
      return true;
    } catch (error) {
      console.error('Failed to reset stats:', error);
      return false;
    }
  };

  return (
    <StatsContext.Provider 
      value={{ 
        growthScore,
        streak,
        lastEntryDate,
        updateGrowthScore,
        resetStats,
        loading 
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

// Custom hook to use the context
export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export default StatsContext; 