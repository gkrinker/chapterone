import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const AchievementsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Achievements Screen</Text>
      <Text style={styles.subtext}>This is where users will see their badges and achievements.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteSmoke,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: COLORS.navyInk,
    textAlign: 'center',
  },
});

export default AchievementsScreen; 