import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

const plans = [
  {
    name: 'Essentials',
    price: '$9.99',
    per: 'per month',
    description: 'Perfect for beginners looking to start their health and fitness journey.',
    features: [
      'Basic nutrition guidelines',
      'Standard workout library',
      'Progress tracking tools',
      'Community forum access',
      'Mobile app access',
      'Cancel anytime',
    ],
    buttonStyle: 'outline',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$19.99',
    per: 'per month',
    description: 'Ideal for those serious about their health goals with personalized guidance.',
    features: [
      'All Essentials features',
      'Personalized nutrition plans',
      'Custom workout programs',
      'Weekly progress reports',
      'Direct messaging with coaches',
      'Priority support',
    ],
    buttonStyle: 'filled',
    highlight: true,
    tag: 'Most Popular',
  },
  {
    name: 'Ultimate',
    price: '$39.99',
    per: 'per month',
    description: 'The complete health and fitness experience with premium features and 1-on-1 coaching.',
    features: [
      'All Premium features',
      '1-on-1 virtual coaching sessions',
      'Advanced health metrics',
      'Meal prep and planning tools',
      'Exclusive wellness content',
      'VIP community events',
    ],
    buttonStyle: 'outline',
    highlight: false,
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;

export default function PricingScreen() {
  const { theme } = useTheme();
  const flatListRef = useRef();
  const [activeIndex, setActiveIndex] = useState(1); // Start on Premium
  const [pressedIdx, setPressedIdx] = useState(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const handleScroll = (event) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(idx);
  };

  const scrollToIndex = (idx) => {
    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
    setActiveIndex(idx);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.header, { color: theme.text }]}>Choose Your Plan</Text>
      <FlatList
        ref={flatListRef}
        data={plans}
        keyExtractor={item => item.name}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.carousel}
        onScroll={handleScroll}
        getItemLayout={(_, index) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * index, index })}
        renderItem={({ item, index }) => {
          const pressed = pressedIdx === index;
          const isFilled = item.buttonStyle === 'filled';
          return (
            <View
              style={[styles.card, item.highlight && { borderColor: theme.primary, shadowColor: theme.primary, shadowOpacity: 0.16, shadowRadius: 12, borderWidth: 2, zIndex: 2 },
                { backgroundColor: theme.card },
              ]}
            >
              {item.tag && (
                <View style={[styles.tag, { backgroundColor: theme.primary }]}> 
                  <Animated.Text style={[styles.tagText, { transform: [{ scale: bounceAnim }] }]}>{item.tag}</Animated.Text>
                </View>
              )}
              <Text style={[styles.planName, { color: theme.text }]}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.planPrice}>{item.price}</Text>
                <Text style={styles.planPer}> {item.per}</Text>
              </View>
              <Text style={[styles.planDesc, { color: theme.textSecondary }]}>{item.description}</Text>
              <View style={styles.featureList}>
                {item.features.map((feature, i) => (
                  <View key={feature} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.featureText, { color: theme.text }]}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  (isFilled || pressed) && { backgroundColor: theme.primary },
                  !isFilled && !pressed && { backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border },
                ]}
                activeOpacity={isFilled ? 0.6 : 1}
                onPressIn={() => setPressedIdx(index)}
                onPressOut={() => setPressedIdx(null)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (isFilled || pressed) ? { color: theme.white } : { color: theme.textSecondary },
                  ]}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.dotsRow}>
        {plans.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.dot, activeIndex === idx && { backgroundColor: theme.primary }]}
            onPress={() => scrollToIndex(idx)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 18,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  carousel: {
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    padding: 24,
    width: CARD_WIDTH,
    marginHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 18,
    position: 'relative',
    elevation: 2,
  },
  tag: {
    position: 'absolute',
    top: -18,
    left: 0,
    right: 0,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 4,
    zIndex: 3,
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  planName: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 6,
    marginTop: 12,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    marginTop: 2,
  },
  planPrice: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#222',
    letterSpacing: 0.5,
  },
  planPer: {
    fontSize: 15,
    color: '#666',
    marginBottom: 3,
  },
  planDesc: {
    color: '#555',
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
    minHeight: 48,
  },
  featureList: {
    marginBottom: 20,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  featureText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 0,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    position: 'relative',
    zIndex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d1d5db',
    marginHorizontal: 5,
  },
});
