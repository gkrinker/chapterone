import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const PromptScheduleSelector = ({ onScheduleChange }) => {
  const [reminderTime, setReminderTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [congratsShown, setCongratsShown] = useState(false);
  
  // Format time to display in 12-hour format
  const formatTime = (date) => {
    if (!date) return 'Select time';
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${formattedMinutes} ${ampm}`;
  };
  
  // Determine prompt type based on time
  const getPromptInfo = (time) => {
    if (!time) {
      return {
        type: 'pending',
        icon: '⚠️',
        label: 'Pending: Select a time to get a reminder for daily growth'
      };
    }
    
    const hours = time.getHours();
    
    if (hours >= 5 && hours < 12) {
      return {
        type: 'morning',
        icon: '☀️',
        label: "You'll get a morning preparation prompt at:"
      };
    } else if (hours >= 12 && hours < 17) {
      return {
        type: 'afternoon',
        icon: '🌤️',
        label: "You'll get an afternoon reflection prompt at:"
      };
    } else {
      return {
        type: 'evening',
        icon: '🌙',
        label: "You'll get an evening reflection prompt at:"
      };
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || reminderTime;
    setShowTimePicker(Platform.OS === 'ios');
    
    // Only show congrats if they're choosing a time for the first time
    // or changing an existing time
    if (currentTime && (!reminderTime || 
        reminderTime.getHours() !== currentTime.getHours() || 
        reminderTime.getMinutes() !== currentTime.getMinutes())) {
      setReminderTime(currentTime);
      
      // Show congratulatory message
      Alert.alert(
        "Great choice!",
        "Congratulations on investing in your personal growth!",
        [{ text: "Thanks!", onPress: () => setCongratsShown(true) }],
        { cancelable: false }
      );
      
      const promptInfo = getPromptInfo(currentTime);
      onScheduleChange({
        promptType: promptInfo.type,
        reminderTime: currentTime
      });
    }
  };
  
  const promptInfo = getPromptInfo(reminderTime);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal Reminders</Text>
      </View>
      
      <View style={styles.messageContainer}>
        <Text style={styles.promptTypeLabel}>
          <Text style={styles.icon}>{promptInfo.icon}</Text> {promptInfo.label}
        </Text>
        
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeText}>{formatTime(reminderTime)}</Text>
        </TouchableOpacity>
      </View>
      
      {showTimePicker && (
        <DateTimePicker
          value={reminderTime || new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.iceBlue,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
  messageContainer: {
    marginBottom: 16,
  },
  promptTypeLabel: {
    fontSize: 15,
    color: COLORS.navyInk,
    marginBottom: 12,
    lineHeight: 22,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.citrusZest,
    backgroundColor: COLORS.citrusZest,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: COLORS.whiteSmoke,
    fontWeight: '500',
  },
});

export default PromptScheduleSelector; 