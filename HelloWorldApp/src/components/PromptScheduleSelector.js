import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert, Modal, Pressable, Animated, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Feather } from '@expo/vector-icons';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA',
  inspiringBlue: '#2A9D8F'
};

const { width } = Dimensions.get('window');

// Helper function to request permissions (can be moved to a utility file later)
async function registerForPushNotificationsAsync() {
  console.log("DEBUG: Entering registerForPushNotificationsAsync");
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log(`DEBUG: Existing notification permission status: ${existingStatus}`);
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    console.log("DEBUG: Requesting notification permissions...");
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  console.log(`DEBUG: Final notification permission status: ${finalStatus}`);

  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for push notification!');
    // It might be more informative to return the status than just return undefined
    // return; 
    return finalStatus; // Return the actual final status
  }
  // Learn more about مم Expo Tokens: https://docs.expo.dev/push-notifications/sending-notifications/#individual-expo-push-tokens
  // token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
  // console.log(token); // We don't need the token for local scheduling

  return finalStatus;
}

// Helper function to schedule notification
async function scheduleDailyNotification(time) {
  const identifier = 'daily-journal-reminder';

  console.log(`DEBUG: Attempting to cancel notification with identifier: ${identifier}`);
  await Notifications.cancelScheduledNotificationAsync(identifier);

  if (!time) {
    console.log('DEBUG: Reminder time is null, cancelling schedule.');
    return;
  }

  const hour = time.getHours();
  const minute = time.getMinutes();

  console.log(`DEBUG: Scheduling notification for hour: ${hour}, minute: ${minute}`);

  const trigger = {
    hour: hour,
    minute: minute,
    repeats: true,
  };
  console.log("DEBUG: Scheduling with trigger:", JSON.stringify(trigger));

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: identifier,
      content: {
        title: "You have a new journaling prompt! 📬",
        body: 'Take a moment today to invest in your growth.',
        sound: 'default',
      },
      trigger: trigger,
    });
    console.log('DEBUG: Daily notification schedule call successful!');

    // --- Add check for scheduled notifications ---
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("DEBUG: Currently scheduled notifications:", JSON.stringify(scheduledNotifications, null, 2));
    // --- End check ---

  } catch (error) {
    console.error('DEBUG: Error scheduling notification:', error);
    Alert.alert('Error', 'Could not schedule the daily notification.');
  }
}

// --- Add this useEffect for foreground handling ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show banner even if app is foreground
    shouldPlaySound: true, // Play sound
    shouldSetBadge: false, // Don't modify badge count (can be true if you manage badges)
  }),
});
console.log("DEBUG: Notification handler set."); // Log handler setup
// --- End of added useEffect ---

const PromptScheduleSelector = ({ reminderTime, onReminderTimeChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempReminderTime, setTempReminderTime] = useState(new Date());
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef();
  const [showCongratsAnimation, setShowCongratsAnimation] = useState(false);
  const congratsAnimation = useRef(new Animated.Value(0)).current;

  // Remove permission request on mount
  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

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
  
  const handleTimePickerChange = (event, selectedTime) => {
    // For iOS, the picker might stay open, so update temp time continuously
    // For Android, the picker closes after selection, event.type === 'set' confirms selection
    if (Platform.OS === 'android') {
        if(event.type === 'set' && selectedTime) {
            setTempReminderTime(selectedTime);
        }
        // On Android, we might hide the modal immediately after selection is confirmed or dismissed
        // setIsModalVisible(false); // Let's keep it open until Submit/Cancel
    } else { // iOS
        if (selectedTime) {
            setTempReminderTime(selectedTime);
        }
    }
  };

  const handleOpenModal = () => {
    // Set initial time for the picker
    let initialPickerTime;
    if (reminderTime) {
      // If a reminder is already set, default the picker to that time
      initialPickerTime = new Date(reminderTime); // Clone the date object
    } else {
      // If no reminder is set, default to one minute in the future
      initialPickerTime = new Date();
      initialPickerTime.setMinutes(initialPickerTime.getMinutes() + 1);
    }
    setTempReminderTime(initialPickerTime); // Set the temp state for the picker
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    console.log("DEBUG: handleSubmit called");
    const permissionStatus = await registerForPushNotificationsAsync();
    if (permissionStatus !== 'granted') {
      console.log(`DEBUG: Permission status is ${permissionStatus}, showing alert.`);
      Alert.alert(
        'Permission Required',
        'Notifications permission is needed to set reminders. Please enable it in your phone settings if you wish to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }
    console.log("DEBUG: Permission granted, proceeding...");

    setIsModalVisible(false);
    onReminderTimeChange(tempReminderTime);

    await scheduleDailyNotification(tempReminderTime);
    console.log("DEBUG: scheduleDailyNotification finished.");

    if (confettiRef.current) {
      console.log("DEBUG: Triggering confetti");
      setShowConfetti(true);
    }

    setShowCongratsAnimation(true);
    Animated.sequence([
      Animated.timing(congratsAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(congratsAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCongratsAnimation(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // No need to reset tempReminderTime, it will be reset on next open
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal Reminders</Text>
      </View>
      
      <View style={styles.messageContainer}>
        {reminderTime ? (
          <Text style={styles.confirmationText}>
            {`🔔 You will be reminded at ${formatTime(reminderTime)} every day to journal and grow.`}
          </Text>
        ) : (
          <Text style={styles.promptTypeLabel}>
            {'⚠️ Pending: Select a time to get a reminder for daily growth'}
          </Text>
        )}
      </View>
      
      {/* Button to open the modal */}
      <TouchableOpacity
        style={styles.selectTimeButton}
        onPress={handleOpenModal}
      >
        <Text style={styles.selectTimeButtonText}>
          {reminderTime ? 'Change time' : 'Select time'}
        </Text>
      </TouchableOpacity>

      {/* Time Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Reminder Time</Text>
            <DateTimePicker
              value={tempReminderTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimePickerChange}
              style={styles.dateTimePicker}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: width / 2, y: 0 }}
          autoStart={true}
          fadeOut={true}
          explosionSpeed={400}
          style={styles.confetti}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      {showCongratsAnimation && (
        <Animated.View 
          style={[
            styles.animationBadge,
            {
              opacity: congratsAnimation,
              transform: [{
                translateY: congratsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }
          ]}
        >
          <Feather name="check-circle" size={20} color={COLORS.whiteSmoke} />
          <Text style={styles.animationText}>Committed to daily growth! 🎉</Text>
        </Animated.View>
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
    overflow: 'visible',
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
  confirmationText: {
    fontSize: 15,
    color: COLORS.navyInk,
    marginBottom: 12,
    lineHeight: 22,
    textAlign: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  selectTimeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.citrusZest,
    backgroundColor: COLORS.citrusZest,
    alignItems: 'center',
  },
  selectTimeButtonText: {
    fontSize: 16,
    color: COLORS.whiteSmoke,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 20,
  },
  dateTimePicker: {
    width: '100%',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.coolGray,
  },
  submitButton: {
    backgroundColor: COLORS.citrusZest,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'none',
  },
  animationBadge: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignSelf: 'center',
    backgroundColor: COLORS.inspiringBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10000,
  },
  animationText: {
    color: COLORS.whiteSmoke,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default PromptScheduleSelector; 