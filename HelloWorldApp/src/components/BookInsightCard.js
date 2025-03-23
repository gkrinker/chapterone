import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from 'react-native-vector-icons';
import { bookInsights, defaultInsights } from '../data/insightsData';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  citrusDark: '#E67E22',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA',
  inspiringBlue: '#3498DB'
};

const BookInsightCard = ({ book = null, onInsightChange }) => {
  const [visible, setVisible] = useState(true);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [insights, setInsights] = useState([]);

  // Update insights when book changes
  useEffect(() => {
    if (book && book.id && bookInsights[book.id]) {
      // Set insights based on book id
      setInsights(bookInsights[book.id]);
    } else if (book) {
      // If book exists but we don't have specific insights for it
      // Use the default insights
      setInsights(defaultInsights);
    } else {
      // If no book is selected, use empty array (component will handle this)
      setInsights([]);
    }
    
    // Reset to first insight when book changes
    setCurrentInsight(0);
  }, [book]);

  // Update parent component when current insight changes
  useEffect(() => {
    if (insights.length > 0 && onInsightChange) {
      onInsightChange(insights[currentInsight]);
    }
  }, [currentInsight, insights, onInsightChange]);

  // Get random insight (different from current)
  const getRandomInsight = () => {
    if (insights.length <= 1) return 0;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * insights.length);
    } while (newIndex === currentInsight);
    
    return newIndex;
  };

  // Refresh with a new random insight
  const handleRefresh = () => {
    setCurrentInsight(getRandomInsight());
  };

  // Dismiss the card
  const handleDismiss = () => {
    setVisible(false);
  };

  // When dismissed, reset after a delay (for demo purposes)
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setVisible(true);
        setCurrentInsight(getRandomInsight());
      }, 30000); // Reset after 30 seconds for demo
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // If no book is selected or insights are empty, don't render
  if (!book || insights.length === 0 || !visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspired by {book.title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRefresh}
          >
            <Feather name="refresh-cw" size={18} color={COLORS.navyInk} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleDismiss}
          >
            <Feather name="x" size={18} color={COLORS.navyInk} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.insightContainer}>
        <Text style={styles.insightText}>
          <Text style={styles.quoteMarks}>"</Text>
          {insights[currentInsight].insight}
          <Text style={styles.quoteMarks}>"</Text>
        </Text>
      </View>

      <View style={styles.promptContainer}>
        <Text style={styles.promptLabel}>Today's Reflection:</Text>
        <Text style={styles.promptText}>
          {insights[currentInsight].prompt}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.iceBlue,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.navyInk,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  insightContainer: {
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  insightText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.navyInk,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  quoteMarks: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.citrusZest,
  },
  promptContainer: {
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 8,
    padding: 12,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 6,
  },
  promptText: {
    fontSize: 15,
    color: COLORS.navyInk,
    lineHeight: 22,
  },
});

export default BookInsightCard; 