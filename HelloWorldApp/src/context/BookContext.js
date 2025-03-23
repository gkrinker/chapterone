import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const BookContext = createContext();

// Create provider component
export const BookProvider = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved book on initial render
  useEffect(() => {
    const loadStoredBook = async () => {
      try {
        const storedBook = await AsyncStorage.getItem('selectedBook');
        if (storedBook) {
          setSelectedBook(JSON.parse(storedBook));
        }
      } catch (error) {
        console.error('Failed to load selected book from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredBook();
  }, []);

  // Save book to storage when it changes
  const updateSelectedBook = async (book) => {
    try {
      setSelectedBook(book);
      if (book) {
        await AsyncStorage.setItem('selectedBook', JSON.stringify(book));
      } else {
        await AsyncStorage.removeItem('selectedBook');
      }
    } catch (error) {
      console.error('Failed to save selected book to storage:', error);
    }
  };

  // Provide context value to children
  return (
    <BookContext.Provider 
      value={{ 
        selectedBook, 
        updateSelectedBook,
        loading 
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

// Custom hook to use the context
export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};

export default BookContext; 