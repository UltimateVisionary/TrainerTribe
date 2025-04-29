import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { fetchDeepSeekResponse } from '../utils/deepseek';
import { DEEPSEEK_API_KEY } from '@env';
import { SUPPORT_SYSTEM_PROMPT } from '../utils/supportGuideline';

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
  return null;
}

export default function SupportChatBot({ apiKey = null }) {
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
    { id: '1', text: 'Hi! I am TrainerTribe Ai. Ask me anything about fitness, nutrition, or app support!', sender: 'bot' },
  ]);
  const flatListRef = useRef(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    // Check if input is a support-specific FAQ
    const faq = getFAQAnswer(input);
    if (faq) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: faq, sender: 'bot' }]);
        setIsTyping(false);
      }, 800);
      return;
    }
    // Otherwise, call DeepSeek logic
    try {
      const reply = await fetchDeepSeekResponse({ prompt: input, apiKey: DEEPSEEK_API_KEY, systemPrompt: SUPPORT_SYSTEM_PROMPT });
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), text: reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now() + 3).toString(), text: 'Sorry, I could not connect to DeepSeek. ' + err.message, sender: 'bot' }]);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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
        <View style={[styles.chatContainer, { backgroundColor: theme.card, borderColor: theme.border, position: 'absolute', height: 300 }]} pointerEvents="box-none"> 
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
              <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble, { backgroundColor: item.sender === 'user' ? theme.primary : theme.background }]}> 
                <Text style={{ color: item.sender === 'user' ? theme.white : theme.text }}>{item.text}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 12, paddingBottom: 56 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          style={{ height: 210 }}
          keyboardShouldPersistTaps="handled"
          pointerEvents="auto"
        />
        {isTyping && (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingBottom: 6 }}>
            <ActivityIndicator size="small" color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.textSecondary }}>TrainerTribe Ai is typing...</Text>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.input }]} 
            placeholder="Type your question..."
            placeholderTextColor={theme.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!isTyping}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isTyping}>
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
    // Removed flex: 1 for independent scroll
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
