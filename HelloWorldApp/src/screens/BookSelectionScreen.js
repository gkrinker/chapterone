import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BookGrid from '../components/BookGrid';
import PromptScheduleSelector from '../components/PromptScheduleSelector';
import BookDetailBottomSheet from '../components/BookDetailBottomSheet';
import ResetButton from '../components/ResetButton';
import { books } from '../data/bookData';
import { useBook } from '../context/BookContext';
import { useJournal } from '../context/JournalContext';
import { useStats } from '../context/StatsContext';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const BookSelectionScreen = () => {
  // Use stats from StatsContext instead of local state
  const { growthScore, streak, resetStats, loading: statsLoading } = useStats();
  
  // Completion percentage state (not stored in StatsContext)
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [schedule, setSchedule] = useState({
    promptType: 'pending',
    reminderTime: null
  });
  
  // Navigation
  const navigation = useNavigation();
  
  // Use the book context instead of local state for confirmed book
  const { selectedBook: confirmedBook, updateSelectedBook } = useBook();
  
  // Get journal data for completion percentage calculation
  const { journalEntries, loading: journalLoading, getAllJournalEntries } = useJournal();

  // Calculate completion percentage based on journal entries
  useEffect(() => {
    if (journalLoading || !journalEntries) return;
    
    // Calculate completion percentage (example: if goal is 30 entries)
    const entryCount = Object.keys(journalEntries).length;
    const goalEntries = 30;
    const percentage = Math.min(100, Math.round((entryCount / goalEntries) * 100));
    setCompletionPercentage(percentage);
    
  }, [journalEntries, journalLoading]);

  // Update book-related UI when book context changes
  useEffect(() => {
    if (confirmedBook) {
      console.log('Current book from context:', confirmedBook.title);
    }
  }, [confirmedBook]);

  // Handle data reset (now using StatsContext)
  const handleDataReset = useCallback(() => {
    console.log("RESET_DEBUG: handleDataReset callback executed in BookSelectionScreen");
    
    // Reset the local state
    setCompletionPercentage(0);
    console.log("RESET_DEBUG: completionPercentage reset to 0");
    
    // The selected book, stats, and journal entries will be reset by the ResetDataButton component
    // We just need to update our UI to reflect those changes
    
    // Force a re-render by setting the state
    setSelectedBook(null);
    console.log("RESET_DEBUG: selectedBook state in BookSelectionScreen set to null");
    
    // Show a confirmation message to the user
    Alert.alert('Reset Complete', 'All data has been successfully reset.');
    console.log("RESET_DEBUG: Reset complete alert shown in BookSelectionScreen");
  }, []);

  const handleBookPress = (book) => {
    setSelectedBook(book);
    setIsBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const handleConfirmBookSelection = (book) => {
    // First, close the bottom sheet
    setIsBottomSheetVisible(false);
    
    // Check if this is the first book selection or changing books
    const isFirstBookSelection = !confirmedBook;
    
    // Update the book in context
    updateSelectedBook(book);
    console.log('Book selected:', book.title);
    console.log('Schedule:', schedule);
    
    // Navigate based on whether this is the first book or changing books
    if (isFirstBookSelection) {
      // If no previous book had been selected, take user to journaling screen
      // and pass parameter to focus the input
      navigation.navigate('Journal', { focusInput: true });
    } else {
      // If changing books, stay on the setup screen with tray lowered
      // No navigation needed as we're already on the setup screen
    }
  };

  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
    console.log('Schedule updated:', newSchedule);
  };

  // Show loading state if data is still loading
  if (journalLoading || statsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        {/* Reset Data Button at the top */}
        <View style={styles.resetButtonContainer}>
          <ResetButton onReset={handleDataReset} />
        </View>
      
        {/* User Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{growthScore}</Text>
            <Text style={styles.statLabel}>Growth Score</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completionPercentage}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
        
        <PromptScheduleSelector onScheduleChange={handleScheduleChange} />
        
        {confirmedBook && (
          <View style={styles.selectedBookContainer}>
            <Text style={styles.selectedLabel}>Currently Reading</Text>
            <View style={styles.selectedBook}>
              <View>
                <Text style={styles.selectedBookTitle}>{confirmedBook.title}</Text>
                <Text style={styles.selectedBookAuthor}>{confirmedBook.author}</Text>
              </View>
            </View>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Choose a Book</Text>
        <BookGrid 
          books={books} 
          onSelectBook={handleBookPress} 
          selectedBookId={confirmedBook?.id} 
        />
      </ScrollView>
      
      <BookDetailBottomSheet 
        book={selectedBook}
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
        onConfirm={handleConfirmBookSelection}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteSmoke,
  },
  scrollView: {
    backgroundColor: COLORS.whiteSmoke,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.navyInk,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.navyInk,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.coolGray,
    marginHorizontal: 8,
  },
  booksContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  selectedBookContainer: {
    backgroundColor: COLORS.iceBlue,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  selectedLabel: {
    fontSize: 14,
    color: COLORS.navyInk,
    marginBottom: 8,
  },
  selectedBook: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedBookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
  selectedBookAuthor: {
    fontSize: 14,
    color: COLORS.navyInk,
  },
  resetButtonContainer: {
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center'
  },
});

export default BookSelectionScreen; 