import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { format, subDays, isToday, parseISO } from 'date-fns';
import { useJournal } from '../context/JournalContext';
import { useStats } from '../context/StatsContext';
import { Feather } from 'react-native-vector-icons';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  citrusDark: '#E67E22',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA',
  completedGreen: '#4CAF50', // Green for completed days
  incompleteGray: '#E0E0E0',  // Light gray for incomplete days
  inspiringBlue: '#3498DB' // Inspiring blue for today's orb
};

// Get greeting based on time of day
const getGreeting = () => {
  const hours = new Date().getHours();
  
  if (hours >= 5 && hours < 12) {
    return { text: "Good morning", icon: "☀️" };
  } else if (hours >= 12 && hours < 18) {
    return { text: "Good afternoon", icon: "🌤️" };
  } else {
    return { text: "Good evening", icon: "🌙" };
  }
};

const StreakCalendar = () => {
  const { journalEntries, loading: journalLoading } = useJournal();
  const { growthScore, streak, loading: statsLoading } = useStats();
  const today = new Date();
  const greeting = getGreeting();
  
  // Get completion data based on journal entries
  const completionData = useMemo(() => {
    const data = {};
    
    // Past 5 days (including today)
    for (let i = 0; i < 5; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      data[dateStr] = !!journalEntries[dateStr]; // Convert to boolean
    }
    
    return data;
  }, [journalEntries, today]);
  
  // Generate the last 5 days (including today)
  const dates = useMemo(() => {
    const result = [];
    for (let i = 4; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isCompleted = completionData[dateStr] || false;
      
      result.push({
        date,
        isCompleted,
        isToday: i === 0
      });
    }
    return result;
  }, [completionData, today]);

  // Render loading state if journal entries are still loading
  if (journalLoading || statsLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting.icon} {greeting.text}</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsLoading}>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting.icon} {greeting.text}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{growthScore}</Text>
            <Text style={styles.statLabel}>Growth Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.calendarRow}>
        {dates.map((dateInfo, index) => (
          <View key={index} style={styles.dayContainer}>
            <View 
              style={[
                styles.dayCircle,
                dateInfo.isCompleted ? styles.completedDay : styles.incompleteDay,
                dateInfo.isToday && !dateInfo.isCompleted && styles.todayCircle
              ]}
            >
              {dateInfo.isCompleted ? (
                // Checkmark for completed days
                <Feather name="check" size={18} color={COLORS.whiteSmoke} />
              ) : (
                // Day number for incomplete days
                <Text 
                  style={[
                    styles.dayText,
                    dateInfo.isToday && styles.todayText
                  ]}
                >
                  {format(dateInfo.date, 'd')}
                </Text>
              )}
            </View>
            <Text style={styles.dayLabel}>{format(dateInfo.date, 'EEE')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navyInk,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.navyInk,
  },
  statDivider: {
    height: '80%',
    width: 1,
    backgroundColor: COLORS.coolGray,
  },
  statsLoading: {
    fontSize: 14,
    color: COLORS.coolGray,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  completedDay: {
    backgroundColor: COLORS.completedGreen,
  },
  incompleteDay: {
    backgroundColor: COLORS.incompleteGray,
  },
  todayCircle: {
    backgroundColor: COLORS.inspiringBlue,
    borderWidth: 2,
    borderColor: COLORS.whiteSmoke,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.whiteSmoke,
  },
  todayText: {
    color: COLORS.whiteSmoke,
  },
  dayLabel: {
    fontSize: 12,
    color: COLORS.navyInk,
  },
});

export default StreakCalendar; 