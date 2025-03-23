import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Animated
} from 'react-native';
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
  const { loading: journalLoading, journalEntries } = useJournal();
  const [currentInsight, setCurrentInsight] = useState(null);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  
  // Stats with animation values
  const [growthScore, setGrowthScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  
  // Animation values
  const scoreAnimation = useState(new Animated.Value(0))[0];
  const streakAnimation = useState(new Animated.Value(0))[0];
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Update streak count based on journal entries
  useEffect(() => {
    if (journalLoading || !journalEntries) return;
    
    let count = 0;
    const dates = Object.keys(journalEntries).sort().reverse(); // Get dates in descending order
    
    for (const date of dates) {
      if (journalEntries[date]) {
        count++;
      } else {
        break; // Break once we find a gap
      }
    }
    
    setStreakCount(count);
    
    // Growth score is based on number of entries
    setGrowthScore(Object.keys(journalEntries).length * 10);
  }, [journalEntries, journalLoading]);

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
    
    // Check if this is a new entry for today or an update
    const isNewEntry = !journalEntries[today];
    
    // Only trigger animations for new entries
    if (isNewEntry) {
      // Animate growth score increase
      setShowScoreAnimation(true);
      Animated.sequence([
        Animated.timing(scoreAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.delay(1500),
        Animated.timing(scoreAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        setShowScoreAnimation(false);
        // Update growth score after animation
        setGrowthScore(prev => prev + 10);
      });
      
      // Animate streak increase
      setShowStreakAnimation(true);
      Animated.sequence([
        Animated.timing(streakAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.delay(1500),
        Animated.timing(streakAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        setShowStreakAnimation(false);
        // Update streak count after animation
        setStreakCount(prev => prev + 1);
      });
    }
    
    console.log('Journal entry saved:', entry);
  }, [journalEntries, today, scoreAnimation, streakAnimation]);

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
        {/* Stats display */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{growthScore}</Text>
            <Text style={styles.statLabel}>Growth Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

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

      {/* Animations that appear when saving a journal entry */}
      {showScoreAnimation && (
        <Animated.View 
          style={[
            styles.animationBadge,
            {
              top: '25%',
              opacity: scoreAnimation,
              transform: [{
                translateY: scoreAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }
          ]}
        >
          <Feather name="trending-up" size={20} color={COLORS.whiteSmoke} />
          <Text style={styles.animationText}>+10 Growth</Text>
        </Animated.View>
      )}

      {showStreakAnimation && (
        <Animated.View 
          style={[
            styles.animationBadge,
            {
              top: '35%',
              opacity: streakAnimation,
              transform: [{
                translateY: streakAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }
          ]}
        >
          <Feather name="award" size={20} color={COLORS.whiteSmoke} />
          <Text style={styles.animationText}>+1 Streak</Text>
        </Animated.View>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.whiteSmoke,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.navyInk,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.coolGray,
    marginHorizontal: 8,
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
  animationBadge: {
    position: 'absolute',
    right: 20,
    backgroundColor: COLORS.inspiringBlue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  animationText: {
    color: COLORS.whiteSmoke,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  }
});

export default JournalScreen; 