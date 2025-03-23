import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Feather } from 'react-native-vector-icons';
import { resetAppData } from '../utils/ResetDataUtil';

// Color palette
const COLORS = {
  navyInk: '#264653',
  whiteSmoke: '#F8F9FA',
  dangerRed: '#e74c3c'
};

const ResetDataButton = ({ onReset }) => {
  const handleReset = async () => {
    const success = await resetAppData();
    if (success && onReset) {
      // Call callback if provided
      onReset();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={handleReset}
        activeOpacity={0.7}
      >
        <Feather name="refresh-cw" size={16} color={COLORS.whiteSmoke} />
        <Text style={styles.resetText}>Reset Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: COLORS.dangerRed,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resetText: {
    color: COLORS.whiteSmoke,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  }
});

export default ResetDataButton; 