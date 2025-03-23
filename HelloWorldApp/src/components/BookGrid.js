import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import BookCard from './BookCard';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA'
};

const BookGrid = ({ books, onSelectBook, selectedBookId }) => {
  if (!books || books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookCard 
            book={item} 
            onPress={onSelectBook} 
            isSelected={selectedBookId === item.id}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.whiteSmoke,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.navyInk,
  },
  container: {
    flex: 1,
  },
});

export default BookGrid; 