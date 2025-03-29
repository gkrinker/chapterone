import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  Animated
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import StreakCalendar from '../components/StreakCalendar';
import BookInsightCard from '../components/BookInsightCard';
import JournalEntryInput from '../components/JournalEntryInput';
import { useBook } from '../context/BookContext';
import { useJournal } from '../context/JournalContext';
import { useStats } from '../context/StatsContext';
import { Feather } from 'react-native-vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const { growthScore, streak, updateGrowthScore, loading: statsLoading } = useStats();
  
  const [currentInsight, setCurrentInsight] = useState(null);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  const [isNewBookSelection, setIsNewBookSelection] = useState(false);
  const journalInputRef = useRef(null);
  
  // Animation values
  const scoreAnimation = useState(new Animated.Value(0))[0];
  const streakAnimation = useState(new Animated.Value(0))[0];
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [scoreAnimationText, setScoreAnimationText] = useState('');
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Navigate to setup tab to select a book
  const navigateToSetup = () => {
    navigation.navigate('Setup');
  };

  // Callback to receive the current insight from BookInsightCard
  const handleInsightChange = useCallback((insight) => {
    setCurrentInsight(insight);
  }, []);

  // Handle successful journal entry save
  const handleJournalSaved = useCallback((entry, entryDate) => {
    setEntrySubmitted(true);
    
    // Check if this is a new entry for today or an update
    const isNewEntry = !journalEntries[entryDate];
    
    // Only trigger animations for new entries
    if (isNewEntry) {
      // Use the StatsContext to update growth score with the entry
      const pointsEarned = updateGrowthScore(10, entry);
      
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
      });
      
      // Update the animation text state with new points
      setScoreAnimationText(`+${pointsEarned} Growth`);
    }
    
    console.log('Journal entry saved:', entry, 'for date:', entryDate);
  }, [journalEntries, scoreAnimation, streakAnimation, updateGrowthScore]);

  // Focus the journal input when a book is first selected and the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Check if this screen was navigated to right after a book selection
      const params = navigation.getState().routes.find(r => r.name === 'Journal')?.params;
      const shouldFocusInput = params?.focusInput || false;
      
      if (selectedBook && shouldFocusInput && journalInputRef.current) {
        // Small delay to ensure the component is fully rendered
        setTimeout(() => {
          journalInputRef.current.focus();
        }, 700);
        
        // Clear the navigation params
        navigation.setParams({ focusInput: false });
      }
      
      return () => {
        // Cleanup function
      };
    }, [selectedBook, navigation])
  );

  // If still loading, show a loading message
  if (bookLoading || journalLoading || statsLoading) {
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
        <KeyboardAwareScrollView
          style={styles.scrollView}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
        >
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
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  // Normal journal screen with selected book
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
      >
        <StreakCalendar />
        
        <BookInsightCard 
          book={selectedBook}
          onInsightChange={handleInsightChange}
        />
        
        <JournalEntryInput 
          ref={journalInputRef}
          currentInsight={currentInsight}
          onSave={handleJournalSaved}
        />
      </KeyboardAwareScrollView>

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
          <Text style={styles.animationText}>{scoreAnimationText}</Text>
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.whiteSmoke,
    paddingVertical: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.navyInk,
    marginTop: 4,
  },
  statDivider: {
    height: '60%',
    width: 1,
    backgroundColor: COLORS.coolGray,
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.navyInk,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookContainer: {
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noBookIcon: {
    marginBottom: 20,
  },
  noBookTitle: {
    fontSize: 22,
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
    lineHeight: 24,
  },
  setupButton: {
    backgroundColor: COLORS.inspiringBlue,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  animationText: {
    color: COLORS.whiteSmoke,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default JournalScreen; 