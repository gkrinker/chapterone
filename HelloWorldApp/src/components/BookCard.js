import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width / 3 - 16; // 3 columns with padding

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA',
  inspiringBlue: '#3498DB'
};

const BookCard = ({ book, onPress, isSelected }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
      onPress={() => onPress(book)}
      activeOpacity={0.7}
    >
      {book.coverImage ? (
        <Image
          source={{ uri: book.coverImage }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderCover}>
          <Text style={styles.placeholderText}>{book.title.substring(0, 1)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
      </View>
      
      {/* Selection indicator */}
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.whiteSmoke,
    shadowColor: COLORS.navyInk,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative', // For absolute positioning of selection indicator
  },
  selectedCard: {
    shadowColor: COLORS.inspiringBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.inspiringBlue,
  },
  cover: {
    width: '100%',
    height: cardWidth * 1.5, // Maintain aspect ratio
    borderTopLeftRadius: 10, // Adjusted for border on selected state
    borderTopRightRadius: 10,
  },
  placeholderCover: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: '#FFFFFF', // Pure white for placeholder
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.navyInk,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.navyInk,
  },
  author: {
    fontSize: 12,
    color: COLORS.citrusZest,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.inspiringBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedText: {
    color: COLORS.whiteSmoke,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BookCard; 