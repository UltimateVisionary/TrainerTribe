import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { fetchDeepSeekResponse } from '../utils/deepseek';
import { DEEPSEEK_API_KEY } from '@env';
import { useLanguage } from '../LanguageContext';

const TypingIndicator = () => {
  const [dots] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  React.useEffect(() => {
    const animations = dots.map((dot, index) => {
      return Animated.sequence([
        Animated.delay(index * 200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    });

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={[styles.messageContainer, styles.botMessage]}>
      <View style={styles.typingContainer}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.typingDot,
              {
                transform: [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Message component now supports disabling animation for history messages
const Message = ({ text, isUser, animate }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 50 : -50)).current;
  // Improved: Only add blank line before numbered list items at line start, not decimals like '1.5 cups'
  let formattedText = text.replace(/(^|\n)(\d+)\.(?=\s)/g, '$1\n$2.').replace(/^\n+/, '');
  // Add extra spacing between paragraphs (convert single \n to double \n except after numbered lists)
  formattedText = formattedText.replace(/([^\n])\n([^\n\d])/g, '$1\n\n$2');
  const [displayedText, setDisplayedText] = React.useState(isUser ? formattedText : (animate ? '' : formattedText));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Typewriter effect for bot messages (only if animate is true)
    if (!isUser && animate) {
      let wordIndex = 0;
      const words = formattedText.split(' ');
      setDisplayedText('');
      const interval = setInterval(() => {
        wordIndex++;
        setDisplayedText(words.slice(0, wordIndex).join(' '));
        if (wordIndex >= words.length) clearInterval(interval);
      }, 80); // Slower: 80ms per word
      return () => clearInterval(interval);
    } else {
      setDisplayedText(formattedText);
    }
  }, [formattedText, isUser, animate]);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.botMessage,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}
    >
      <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
        {displayedText}
      </Text>
    </Animated.View>
  );
};

const SUGGESTED_QUESTIONS = [
  "How can I improve my squat form?",
  "What's a good meal plan for muscle gain?",
  "Tips for staying motivated?",
  "Best exercises for core strength?",
  "How to track my fitness progress?",
];

// Optionally accept apiKey as a prop for future integration
export default function ChatbotModal({ visible, onClose, apiKey = null }) {
  const { t, language } = useLanguage();
  // Animation for AI in TrainerTribe
  const aiPulseAnim = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    let pulse;
    if (visible) {
      aiPulseAnim.setValue(1);
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(aiPulseAnim, {
            toValue: 0.5,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(aiPulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    }
    return () => {
      if (pulse) pulse.stop();
    };
   }, [visible]);
   // Only initialize the welcome message once, persist chat across modal opens
   const [messages, setMessages] = useState(() => [
     {
       text: language === 'en' ? "Hey! I'm your personal fitness assistant powered by Ai. I can help with workout ideas, meal plans, form correction and more! What would you like to know?" : t('chatbotWelcome'),
       isUser: false,
     },
   ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = async () => {
  console.log('DEEPSEEK_API_KEY:', DEEPSEEK_API_KEY);
    if (!input.trim()) return;

    const userMessage = { text: input.trim(), isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Adaptive Workout Plans & Emotion-Aware Responses
    // This logic is now encapsulated for easy use with OpenAI API integration later
    function getAdaptiveBotResponse({ userInput, lastBotMessage }) {
      const lowerInput = userInput.trim().toLowerCase();
      const frustratedWords = ["can't", "cannot", "hard", "difficult", "impossible", "frustrated", "stuck", "fail", "struggling"];
      const isFrustrated = frustratedWords.some(word => lowerInput.includes(word));
      const checkinQuestions = [
        "How sore are you today? 🧐 (Not at all / A little / Very)",
        "How much energy do you have right now? (Low / Medium / High)",
        "Any areas you'd like to focus on or avoid today?"
      ];
      const askedCheckin = checkinQuestions.some(q => lastBotMessage.includes(q));
      let text = '';
      if (isFrustrated) {
        text = "You’ve got this—try dropping weight by 10% and focusing on form! Progress takes time—be kind to yourself.";
      } else if (!askedCheckin) {
        text = checkinQuestions[0];
      } else if (lastBotMessage.includes(checkinQuestions[0])) {
        if (lowerInput.includes("not at all")) {
          text = "Awesome! Let's push a bit harder today—I'll increase intensity slightly.";
        } else if (lowerInput.includes("a little")) {
          text = "Great, I'll keep your workout moderate. Ready for a balanced session?";
        } else if (lowerInput.includes("very")) {
          text = "Let's focus on recovery and mobility today! I'll reduce the intensity and volume.";
        } else {
          text = "Thanks for letting me know! I'll adjust your plan accordingly.";
        }
      } else {
        text = "I'm processing your question about " + lowerInput + ". In a real implementation, this would connect to an AI service to provide personalized fitness guidance.";
      }
      return { text, isUser: false };
    }

    // Get the last bot message (not user message) for context
    const lastBotMessageObj = [...messages].reverse().find(m => !m.isUser);
    const lastBotMessage = lastBotMessageObj ? lastBotMessageObj.text : '';

    // Always use DeepSeek for AI responses
    try {
      const reply = await fetchDeepSeekResponse({ prompt: input, apiKey: DEEPSEEK_API_KEY });
      setIsTyping(false);
      setMessages(prev => [...prev, { text: reply, isUser: false, animate: true }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: 'Sorry, I could not connect to DeepSeek. ' + err.message, isUser: false, animate: true }]);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.modalContent}>
          <View style={styles.brandHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Animated.View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                {'Tr'}
                <Animated.Text
                  style={[
                    styles.headerTitleAI,
                    {
                      opacity: aiPulseAnim,
                      transform: [
                        { scale: aiPulseAnim.interpolate({ inputRange: [0.5, 1], outputRange: [1, 1.25] }) },
                      ],
                    },
                  ]}
                >
                  a
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.headerTitleAI,
                    {
                      opacity: aiPulseAnim,
                      transform: [
                        { scale: aiPulseAnim.interpolate({ inputRange: [0.5, 1], outputRange: [1, 1.25] }) },
                      ],
                    },
                  ]}
                >
                  i
                </Animated.Text>
                {'nerTribe'}
              </Text>
              <Text style={styles.headerSubtitle}>Fitness Assistant</Text>
            </Animated.View>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, idx) => (
              <Message
                key={idx}
                text={msg.text}
                isUser={msg.isUser}
                animate={!!msg.animate}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </ScrollView>

          <View style={styles.suggestedContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestedQuestion(question)}
                >
                  <Text style={styles.suggestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask me anything about fitness..."
              placeholderTextColor={COLORS.text.secondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={input.trim() ? COLORS.white : '#999'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3464db',
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    padding: 4,
    borderRadius: 16,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  headerTitleAI: {
    color: '#dfe0e2',
    fontWeight: 'bold',
    textShadowColor: '#6e727c',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    fontSize: 22,
    marginHorizontal: 2,
  },
  headerSubtitle: {
    color: '#dfe0e2',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGrey,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 26, // More line height for readability
    marginBottom: 4, // Add space between paragraphs
  },
  userMessageText: {
    color: COLORS.white,
  },
  botMessageText: {
    color: COLORS.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: 16,
    minHeight: 44,
    maxHeight: 100,
    color: COLORS.text.primary,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.lightGrey,
  },
  suggestedContainer: {
    padding: 16,
    paddingTop: 12, // Add more top padding to move buttons down
    paddingBottom: 16, // Add bottom padding for even spacing
  },
  suggestionChip: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10, // Slightly taller for more touch area
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4, // Add bottom margin for vertical spacing
  },
  suggestionText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  typingContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text.primary,
    marginHorizontal: 3,
  },
}); 