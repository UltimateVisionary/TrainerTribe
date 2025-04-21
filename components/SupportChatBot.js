import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

const FAQ_ANSWERS = {
  'password': 'To reset your password, go to Profile > Settings > Change Password and follow the prompts.',
  'subscription': 'To manage your subscription, visit Settings > Subscription to view, change, or cancel your plan.',
  'contact': 'You can contact support by emailing support@trainertribe.com or using this chatbot for help.',
  'delete account': 'To delete your account, please email support@trainertribe.com with your request.',
  'notifications': 'You can manage notifications in Settings > Preferences > Notifications.',
  'update profile': 'To update your profile, go to Settings > Personal Info.',
  'app not working': 'Try closing and reopening the app, or reinstalling it. If the issue persists, contact support.',
  'features': 'Check out our Explore and Community tabs for the latest features and updates!',
  'refund': 'For refund requests, please email support@trainertribe.com with your order details.'
};

function getFAQAnswer(question) {
  const lower = question.toLowerCase();
  for (const keyword in FAQ_ANSWERS) {
    if (lower.includes(keyword)) return FAQ_ANSWERS[keyword];
  }
  return "I'm here to help with support questions! Please describe your issue or type 'contact' to reach our team.";
}

export default function SupportChatBot() {
  // Pulsing Glow Animation
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.7, duration: 1200, useNativeDriver: true })
      ])
    ).start();
  }, [glowAnim]);
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! I am the TrainerTribe Support Bot. Ask me anything about using the app or getting help.', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    const botMsg = { id: (Date.now() + 1).toString(), text: getFAQAnswer(input), sender: 'bot' };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              opacity: glowAnim,
              shadowOpacity: glowAnim,
              backgroundColor: '#3b82f6',
              shadowColor: '#3b82f6',
              transform: [{ scale: glowAnim }],
            },
          ]}
        />
        <View style={[styles.chatContainer, { backgroundColor: theme.card, borderColor: theme.border, position: 'absolute' }]}> 
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
              <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble, { backgroundColor: item.sender === 'user' ? theme.primary : theme.background }]}> 
                <Text style={{ color: item.sender === 'user' ? theme.white : theme.text }}>{item.text}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 12 }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.input }]} 
            placeholder="Type your support question..."
            placeholderTextColor={theme.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    width: 320,
    height: 320,
    marginLeft: -160,
    marginTop: -160,
    borderRadius: 160,
    zIndex: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
    shadowOpacity: 0.8,
    opacity: 0.7,
  },
  chatContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
    minHeight: 260,
    maxHeight: 380,
    overflow: 'hidden',
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  botBubble: {
    borderTopLeftRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    padding: 6,
  },
});
