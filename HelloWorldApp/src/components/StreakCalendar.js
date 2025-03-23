import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { format, subDays } from 'date-fns';

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

// This is a placeholder. In a real app, this would come from a database or API
const getDummyCompletionData = () => {
  const today = new Date();
  
  // For demo purposes: simulate the user completed entries 2 days ago and today
  return {
    [format(today, 'yyyy-MM-dd')]: true,                 // Today (completed)
    [format(subDays(today, 1), 'yyyy-MM-dd')]: false,    // Yesterday (not completed)
    [format(subDays(today, 2), 'yyyy-MM-dd')]: true,     // 2 days ago (completed)
    [format(subDays(today, 3), 'yyyy-MM-dd')]: false,    // 3 days ago (not completed)
    [format(subDays(today, 4), 'yyyy-MM-dd')]: true,     // 4 days ago (completed)
  };
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
  const today = new Date();
  const completionData = getDummyCompletionData();
  const greeting = getGreeting();
  
  // Generate the last 5 days (including today)
  const dates = [];
  for (let i = 4; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = completionData[dateStr] || false;
    
    dates.push({
      date,
      isCompleted,
      isToday: i === 0
    });
  }
  
  // Calculate current streak
  let currentStreak = 0;
  // Start from today and go backwards
  for (let i = 0; i < dates.length; i++) {
    if (dates[dates.length - 1 - i].isCompleted) {
      currentStreak++;
    } else {
      break; // Break the streak when we find an incomplete day
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting.icon} {greeting.text}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakCount}>{currentStreak}</Text>
          <Text style={styles.streakText}>day{currentStreak !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      
      <View style={styles.calendarRow}>
        {dates.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.dateContainer,
              item.isToday && styles.todayContainer
            ]}
          >
            <View 
              style={[
                styles.completionOrb,
                item.isToday ? styles.todayOrb : null,
                {
                  backgroundColor: item.isToday 
                    ? COLORS.inspiringBlue 
                    : (item.isCompleted 
                        ? COLORS.completedGreen 
                        : COLORS.incompleteGray)
                }
              ]}
            />
            <Text 
              style={[
                styles.dayText,
                item.isToday && styles.todayText
              ]}
            >
              {format(item.date, 'd')}
            </Text>
            <Text 
              style={[
                styles.monthText,
                item.isToday && styles.todayText
              ]}
            >
              {format(item.date, 'MMM')}
            </Text>
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
    padding: 15,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
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
    fontSize: 14,
    color: COLORS.navyInk,
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: COLORS.citrusZest,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.whiteSmoke,
    marginRight: 4,
  },
  streakText: {
    fontSize: 14,
    color: COLORS.whiteSmoke,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  todayContainer: {
    backgroundColor: COLORS.iceBlue,
    // Removed border
  },
  completionOrb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  todayOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // Removed border
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navyInk,
  },
  monthText: {
    fontSize: 14,
    color: COLORS.navyInk,
    marginTop: 2,
  },
  todayText: {
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
});

export default StreakCalendar; 