import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const BookDetailBottomSheet = ({ visible, book, onClose, onConfirm }) => {
  if (!book) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={styles.bottomSheet}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.handle} />
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Image 
                  source={{ uri: book.coverImage }} 
                  style={styles.cover}
                  resizeMode="cover"
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{book.title}</Text>
                  <Text style={styles.author}>by {book.author}</Text>
                  <Text style={styles.category}>{book.category}</Text>
                </View>
              </View>
              
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>Key Insights</Text>
                {book.keyInsights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
              
              <Text style={styles.description}>
                Select this book to receive daily journal prompts inspired by its key insights.
              </Text>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => onConfirm(book)}
              >
                <Text style={styles.confirmButtonText}>Select This Book</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.whiteSmoke,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.6,
    maxHeight: height * 0.9,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.coolGray,
    borderRadius: 2,
    marginVertical: 12,
    alignSelf: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: COLORS.citrusZest,
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: COLORS.navyInk,
    fontWeight: '500',
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.citrusZest,
  },
  insightText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.navyInk,
    lineHeight: 22,
  },
  description: {
    fontSize: 16,
    color: COLORS.coolGray,
    lineHeight: 22,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: COLORS.citrusZest,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.whiteSmoke,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailBottomSheet; 