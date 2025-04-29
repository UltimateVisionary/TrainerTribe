import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Dummy data for demonstration; replace with real API calls
const DUMMY_COMMENTS = [
  { id: '1', user: 'Alice', text: 'Great post! 💪', timestamp: '2025-04-27 10:00' },
  { id: '2', user: 'Bob', text: 'Very inspiring, thanks for sharing.', timestamp: '2025-04-27 10:05' },
  { id: '3', user: 'You', text: 'Thanks everyone!', timestamp: '2025-04-27 10:06' },
];

export default function CommentScreen({ route }) {
  const { theme } = useTheme();
  const [comments, setComments] = useState(DUMMY_COMMENTS); // Replace with fetched comments
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const postId = route?.params?.postId;

  // Scroll to bottom when a new comment is added
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [comments]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newComment = {
      id: String(comments.length + 1),
      user: 'You', // Replace with real user
      text: input,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setComments([...comments, newComment]);
    setInput('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.commentContainer, { backgroundColor: theme.card }]}>  
      <Text style={[styles.commentUser, { color: theme.primary }]}>{item.user}</Text>
      <Text style={[styles.commentText, { color: theme.text }]}>{item.text}</Text>
      <Text style={[styles.commentTimestamp, { color: theme.textSecondary }]}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.inputRow, { backgroundColor: theme.card, borderTopColor: theme.border }]}>  
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Add a comment..."
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  commentUser: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  sendButton: {
    marginLeft: 8,
    padding: 6,
  },
});
