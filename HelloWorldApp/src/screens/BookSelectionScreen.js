import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BookGrid from '../components/BookGrid';
import PromptScheduleSelector from '../components/PromptScheduleSelector';
import BookDetailBottomSheet from '../components/BookDetailBottomSheet';
import { books } from '../data/bookData';
import { useBook } from '../context/BookContext';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const BookSelectionScreen = () => {
  // User stats - initial values
  const [growthScore, setGrowthScore] = useState(0);
  const [journalingStreak, setJournalingStreak] = useState(0);
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

  // Update book-related UI when book context changes
  useEffect(() => {
    if (confirmedBook) {
      console.log('Current book from context:', confirmedBook.title);
    }
  }, [confirmedBook]);

  const handleBookPress = (book) => {
    setSelectedBook(book);
    setIsBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const handleConfirmBookSelection = (book) => {
    // Update the book in context
    updateSelectedBook(book);
    setIsBottomSheetVisible(false);
    console.log('Book selected:', book.title);
    console.log('Schedule:', schedule);
    
    // Navigate to Journal tab after book selection
    navigation.navigate('Journal');
  };

  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
    console.log('Schedule updated:', newSchedule);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        {/* User Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{growthScore}</Text>
            <Text style={styles.statLabel}>Growth Score</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{journalingStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completionPercentage}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
        
        <PromptScheduleSelector onScheduleChange={handleScheduleChange} />
        
        {confirmedBook ? (
          <View style={styles.selectedBookContainer}>
            <Text style={styles.selectedLabel}>Currently Selected Book:</Text>
            <View style={styles.selectedBook}>
              <Text style={styles.selectedBookTitle}>{confirmedBook.title}</Text>
              <Text style={styles.selectedBookAuthor}>by {confirmedBook.author}</Text>
            </View>
          </View>
        ) : null}
        
        <View style={styles.booksContainer}>
          <Text style={styles.sectionTitle}>Select book to inspire your journaling:</Text>
          <BookGrid 
            books={books} 
            onSelectBook={handleBookPress}
            selectedBookId={confirmedBook ? confirmedBook.id : null} 
          />
        </View>
      </ScrollView>
      
      <BookDetailBottomSheet
        visible={isBottomSheetVisible}
        book={selectedBook}
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
});

export default BookSelectionScreen; 