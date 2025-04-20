import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const TypingDot = ({ delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(animation).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity,
        },
      ]}
    />
  );
};

const TypingIndicator = () => {
  return (
    <View style={styles.container}>
      <TypingDot delay={0} />
      <TypingDot delay={200} />
      <TypingDot delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    maxWidth: '50%',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
  },
});

export default TypingIndicator; 