import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StreakCalendar from '../components/StreakCalendar';
import BookInsightCard from '../components/BookInsightCard';
import JournalEntryInput from '../components/JournalEntryInput';
import { useBook } from '../context/BookContext';
import { useJournal } from '../context/JournalContext';
import { Feather } from 'react-native-vector-icons';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA',
  inspiringBlue: '#3498DB'
};

const JournalScreen = () => {
  const navigation = useNavigation();
  const { selectedBook, loading: bookLoading } = useBook();
  const { loading: journalLoading } = useJournal();
  const [currentInsight, setCurrentInsight] = useState(null);
  const [entrySubmitted, setEntrySubmitted] = useState(false);

  // Navigate to setup tab to select a book
  const navigateToSetup = () => {
    navigation.navigate('Setup');
  };

  // Callback to receive the current insight from BookInsightCard
  const handleInsightChange = useCallback((insight) => {
    setCurrentInsight(insight);
  }, []);

  // Handle successful journal entry save
  const handleJournalSaved = useCallback((entry) => {
    setEntrySubmitted(true);
    console.log('Journal entry saved:', entry);
    // You could implement a success message or animation here
  }, []);

  // If still loading, show a loading message
  if (bookLoading || journalLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no book is selected, show a message to select a book
  if (!selectedBook) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Streak Calendar still shows even when no book selected */}
          <StreakCalendar />
          
          <View style={styles.noBookContainer}>
            <Feather name="book-open" size={60} color={COLORS.coolGray} style={styles.noBookIcon} />
            <Text style={styles.noBookTitle}>Get Started with Journaling</Text>
            <Text style={styles.noBookText}>
              Select a book in the Setup tab to receive personalized insights and journaling prompts.
            </Text>
            <TouchableOpacity style={styles.setupButton} onPress={navigateToSetup}>
              <Text style={styles.setupButtonText}>Go to Setup</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Normal journal screen with selected book
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Streak Calendar Component */}
        <StreakCalendar />
        
        {/* Book Insight Card - passing an onInsightChange callback */}
        <BookInsightCard 
          book={selectedBook}
          onInsightChange={handleInsightChange}
        />
        
        {/* Journal Entry Input Component */}
        <JournalEntryInput 
          currentInsight={currentInsight}
          onSave={handleJournalSaved}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.whiteSmoke,
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.navyInk,
  },
  noBookContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    marginTop: 30,
    marginHorizontal: 16,
    backgroundColor: COLORS.iceBlue,
    borderRadius: 12,
  },
  noBookIcon: {
    marginBottom: 20,
  },
  noBookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 12,
    textAlign: 'center',
  },
  noBookText: {
    fontSize: 16,
    color: COLORS.navyInk,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  setupButton: {
    backgroundColor: COLORS.citrusZest,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  setupButtonText: {
    color: COLORS.whiteSmoke,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JournalScreen; 