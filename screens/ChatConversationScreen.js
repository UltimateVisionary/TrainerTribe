import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import TypingIndicator from '../components/TypingIndicator';
import MessageReactions from '../components/MessageReactions';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MessageBubble = ({ message, isOwnMessage, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);
  const longPressTimeout = useRef(null);

  const handlePressIn = () => {
    longPressTimeout.current = setTimeout(() => {
      setShowReactions(true);
    }, 500); // Show after 500ms hold
  };

  const handlePressOut = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handlePress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    setShowReactions(false);
  };

  const renderContent = () => {
    if (message.image) {
      return (
        <TouchableOpacity onPress={() => {}}>
          <Image 
            source={{ uri: message.image }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
    return (
      <Text style={[
        styles.messageText,
        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
      ]}>
        {message.text}
      </Text>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;
    
    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(
          message.reactions.reduce((acc, reaction) => {
            acc[reaction] = (acc[reaction] || 0) + 1;
            return acc;
          }, {})
        ).map(([reaction, count]) => (
          <View key={reaction} style={styles.reactionBadge}>
            <Text style={styles.reactionEmoji}>
              {reaction === 'love' ? '❤️' : 
               reaction === 'like' ? '👍' :
               reaction === 'fire' ? '🔥' :
               reaction === 'clap' ? '👏' :
               reaction === 'smile' ? '😊' : '💪'}
            </Text>
            {count > 1 && (
              <Text style={styles.reactionCount}>{count}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Pressable 
      style={[
        styles.messageBubbleContainer,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <View style={[
        styles.messageBubble,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {renderContent()}
        {renderReactions()}
      </View>
      <Text style={styles.messageTime}>
        {message.time}
      </Text>
      {isOwnMessage && (
        <View style={styles.messageStatus}>
          <Ionicons 
            name={message.read ? "checkmark-done" : "checkmark"} 
            size={16} 
            color={message.read ? COLORS.primary : COLORS.text.secondary} 
          />
        </View>
      )}
      <MessageReactions
        isVisible={showReactions}
        onReactionSelect={(reaction) => {
          onReaction(message.id, reaction);
          setShowReactions(false);
        }}
        existingReactions={message.reactions || []}
      />
    </Pressable>
  );
};

const ChatConversationScreen = ({ route, navigation }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hey! How's your fitness journey going?",
      time: '10:30 AM',
      sender: 'other',
      read: true,
      reactions: ['love', 'fire'],
    },
    {
      id: '2',
      text: 'Great! Just completed my morning workout 💪',
      time: '10:32 AM',
      sender: 'self',
      read: true,
      reactions: ['clap', 'clap', 'fire'],
    },
    {
      id: '3',
      text: "That's awesome! Would you like to join my HIIT session tomorrow?",
      time: '10:33 AM',
      sender: 'other',
      read: true,
    },
  ]);

  const typingTimeout = useRef(null);
  const flatListRef = useRef(null);
  const { otherUser } = route.params || {
    otherUser: {
      name: 'Sarah Johnson',
      image: require('../assets/trainer1.jpg'),
      status: 'online',
      type: 'Certified Trainer',
    }
  };

  const handleReaction = (messageId, reaction) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: [...(msg.reactions || []), reaction],
        };
      }
      return msg;
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'self',
        read: false,
      };
      setMessages(prev => [...prev, newMessage]);
      setShowAttachments(false);
    }
  };

  // Simulate other user typing when we send a message
  const simulateTyping = () => {
    setIsTyping(true);
    // Stop typing after 2-3 seconds and send a response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's great to hear! 🎉",
        "Thanks for sharing! 💪",
        "Awesome progress! Keep it up! 🔥",
        "Looking forward to our next session! 💫"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const newMessage = {
        id: Date.now().toString(),
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'other',
        read: false,
      };
      setMessages(prev => [...prev, newMessage]);
    }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
  };

  const sendMessage = () => {
    if (message.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'self',
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);

    // Simulate the other user typing and responding
    simulateTyping();
  };

  // Handle user typing indication
  const handleTyping = (text) => {
    setMessage(text);
    
    // Clear any existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set a new timeout
    typingTimeout.current = setTimeout(() => {
      // Handle typing stopped
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image source={otherUser.image} style={styles.userImage} />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{otherUser.name}</Text>
              <View style={styles.userStatus}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: otherUser.status === 'online' ? '#4CAF50' : COLORS.text.secondary }
                ]} />
                <Text style={styles.userType}>{otherUser.type}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwnMessage={item.sender === 'self'}
              onReaction={handleReaction}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={() => isTyping ? <TypingIndicator /> : null}
        />
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -10 : 10}
        style={styles.keyboardAvoid}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.attachButton}
              onPress={() => setShowAttachments(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={handleTyping}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.text.secondary}
              multiline
              maxHeight={100}
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                message.trim().length === 0 && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={message.trim().length === 0}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={message.trim().length === 0 ? COLORS.text.secondary : COLORS.white} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showAttachments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachments(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowAttachments(false)}
        >
          <View style={styles.attachmentsPanel}>
            <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
              <View style={styles.attachmentIcon}>
                <Ionicons name="image" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.attachmentText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentOption}>
              <View style={styles.attachmentIcon}>
                <Ionicons name="camera" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.attachmentText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentOption}>
              <View style={styles.attachmentIcon}>
                <Ionicons name="document" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.attachmentText}>Document</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeTop: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoid: {
    backgroundColor: COLORS.white,
    width: '100%',
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 4 : 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  userType: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  moreButton: {
    padding: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageBubbleContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  ownMessage: {
    backgroundColor: COLORS.primary,
  },
  otherMessage: {
    backgroundColor: COLORS.lightGrey,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.text.primary,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
    marginHorizontal: 4,
  },
  messageStatus: {
    position: 'absolute',
    right: -20,
    bottom: 4,
  },
  attachButton: {
    padding: 4,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 4,
    fontSize: 15,
    color: COLORS.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.lightGrey,
  },
  messageImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6 * 0.75,
    borderRadius: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 12,
    marginLeft: 2,
    color: COLORS.text.secondary,
  },
  reactionsPanel: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  attachmentsPanel: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attachmentOption: {
    alignItems: 'center',
  },
  attachmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 12,
    color: COLORS.text.primary,
  },
});

export default ChatConversationScreen; 