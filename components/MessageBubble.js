import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Pressable } from 'react-native';
import { COLORS } from '../constants/colors';
import MessageReactions from './MessageReactions';
import ChatbotAvatar from './ChatbotAvatar';

const MessageBubble = ({ message, isOwnMessage, onReactionSelect }) => {
  const [showReactions, setShowReactions] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimeout = useRef(null);

  const handleLongPress = () => {
    if (!showReactions) {
      setShowReactions(true);
    }
  };

  const handleReactionSelect = (reaction) => {
    onReactionSelect(message.id, reaction);
    setShowReactions(false);
  };

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}> 
      <View style={styles.messageWrapper}>
        {/* Show avatar for AI messages */}
        {!isOwnMessage && message.isAI && (
          <ChatbotAvatar size={28} />
        )}
        <TouchableWithoutFeedback
          onLongPress={handleLongPress}
          delayLongPress={200}
        >
          <View style={[
            styles.bubble,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
            showReactions && styles.bubbleWithReactions
          ]}>
            <Text style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText
            ]}>
              {message.text}
            </Text>
            {message.reactions && message.reactions.length > 0 && (
              <View style={styles.reactionsContainer}>
                {message.reactions.map((reaction, index) => (
                  <Text key={index} style={styles.reactionEmoji}>
                    {reaction}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <MessageReactions
          isVisible={showReactions}
          existingReactions={message.reactions || []}
          onReactionSelect={handleReactionSelect}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    paddingTop: 60,
  },
  messageWrapper: {
    position: 'relative',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 20,
    padding: 12,
    position: 'relative',
    zIndex: 1,
  },
  bubbleWithReactions: {
    zIndex: 2,
  },
  ownMessage: {
    backgroundColor: COLORS.primary,
    marginLeft: 40,
  },
  otherMessage: {
    backgroundColor: COLORS.gray[200],
    marginRight: 40,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.text.primary,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
});

export default MessageBubble; 