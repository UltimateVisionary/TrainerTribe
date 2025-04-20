import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const REACTIONS = [
  { emoji: '❤️', name: 'love' },
  { emoji: '👍', name: 'like' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '👏', name: 'clap' },
  { emoji: '😊', name: 'smile' },
  { emoji: '💪', name: 'strong' },
];

const MessageReactions = ({ onReactionSelect, existingReactions = [], isVisible }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 15,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.reactionPanel,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {REACTIONS.map((reaction) => (
          <TouchableOpacity
            key={reaction.name}
            style={[
              styles.reactionItem,
              existingReactions.includes(reaction.name) && styles.reactionItemSelected
            ]}
            onPress={() => onReactionSelect(reaction.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
            {existingReactions.includes(reaction.name) && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -55,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  reactionPanel: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reactionItem: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  reactionItemSelected: {
    backgroundColor: COLORS.primaryLight + '30',
  },
  reactionEmoji: {
    fontSize: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    transform: [{ translateX: -2 }],
  },
});

export default MessageReactions; 