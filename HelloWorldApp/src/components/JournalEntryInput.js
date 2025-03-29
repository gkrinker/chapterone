import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from 'react-native-vector-icons';
import { useJournal } from '../context/JournalContext';

// Color palette
const COLORS = {
  iceBlue: '#E1F5F2',
  navyInk: '#264653',
  citrusZest: '#F4A261',
  coolGray: '#CED4DA',
  whiteSmoke: '#F8F9FA',
  inspiringBlue: '#3498DB',
  successGreen: '#2ECC71'
};

const JournalEntryInput = forwardRef(({ currentInsight, onSave }, ref) => {
  const [entryText, setEntryText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { saveJournalEntry, getJournalEntry } = useJournal();
  const inputRef = useRef(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Check if there's already an entry for today
  useEffect(() => {
    const todayEntry = getJournalEntry(today);
    if (todayEntry) {
      setEntryText(todayEntry.text || '');
    }
    
    // Auto-focus the text input when component mounts
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500); // Short delay to ensure component is fully rendered
  }, [today, getJournalEntry]);
  
  const handleSave = async () => {
    if (!entryText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }
    
    setSaving(true);
    Keyboard.dismiss();
    
    try {
      // Save the entry with the prompt and insight from today
      const entryData = {
        text: entryText,
        date: today,
        timestamp: new Date().toISOString(),
        insight: currentInsight?.insight || '',
        prompt: currentInsight?.prompt || '',
      };
      
      const success = await saveJournalEntry(today, entryData);
      
      if (success) {
        setSaved(true);
        // Reset saved status after 3 seconds
        setTimeout(() => setSaved(false), 3000);
        
        // Call the onSave callback if provided, passing the entry and today's date
        if (onSave) onSave(entryData, today);
      } else {
        Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Your Journal Entry</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            multiline
            placeholder="Write your thoughts here..."
            placeholderTextColor={COLORS.coolGray}
            value={entryText}
            onChangeText={setEntryText}
            textAlignVertical="top"
            autoFocus={Platform.OS === 'web'} // For web platform
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, saved && styles.savedButton]}
          onPress={handleSave}
          disabled={saving || saved}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.whiteSmoke} size="small" />
          ) : saved ? (
            <>
              <Feather name="check-circle" size={16} color={COLORS.whiteSmoke} />
              <Text style={styles.saveButtonText}>Saved!</Text>
            </>
          ) : (
            <>
              <Feather name="save" size={16} color={COLORS.whiteSmoke} />
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navyInk,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: COLORS.iceBlue,
    borderRadius: 8,
    minHeight: 150,
    padding: 2,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: COLORS.navyInk,
    minHeight: 150,
  },
  saveButton: {
    backgroundColor: COLORS.inspiringBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  savedButton: {
    backgroundColor: COLORS.successGreen,
  },
  saveButtonText: {
    color: COLORS.whiteSmoke,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default JournalEntryInput; 