import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

// Import screens
import BookSelectionScreen from '../screens/BookSelectionScreen';
import JournalScreen from '../screens/JournalScreen';
import AchievementsScreen from '../screens/AchievementsScreen';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  citrusDark: '#E67E22', // Darker orange for selected tab
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: COLORS.whiteSmoke,
          tabBarInactiveTintColor: COLORS.whiteSmoke,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
          tabBarItemStyle: styles.tabBarItem,
          tabBarActiveBackgroundColor: COLORS.citrusDark,
        })}
      >
        <Tab.Screen
          name="Setup"
          component={BookSelectionScreen}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Feather 
                name="settings" 
                color={COLORS.whiteSmoke} 
                size={size} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalScreen}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Feather 
                name="edit" 
                color={COLORS.whiteSmoke} 
                size={size} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Feather 
                name="award" 
                color={COLORS.whiteSmoke} 
                size={size} 
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.citrusZest,
    borderTopWidth: 1,
    borderTopColor: COLORS.coolGray,
    paddingTop: 5,
    paddingBottom: 5,
    height: 60,
    paddingHorizontal: 5,
  },
  tabBarLabel: {
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 5,
    color: COLORS.whiteSmoke,
  },
  tabBarItem: {
    marginHorizontal: 5,
    borderRadius: 10,
    paddingTop: 5,
  },
});

export default AppNavigator; 