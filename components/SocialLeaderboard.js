import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useTheme } from '../ThemeContext';

// Dummy leaderboard data
const LEADERBOARD = [
  {
    id: '1',
    name: 'Laura S.',
    avatar: require('../assets/trainer1.jpg'),
    sales: 128,
  },
  {
    id: '2',
    name: 'Mike F.',
    avatar: require('../assets/trainer2.jpg'),
    sales: 112,
  },
  {
    id: '3',
    name: 'Sarah K.',
    avatar: require('../assets/trainer1.jpg'),
    sales: 108,
  },
  {
    id: '4',
    name: 'Emma T.',
    avatar: require('../assets/trainer2.jpg'),
    sales: 99,
  },
  {
    id: '5',
    name: 'John D.',
    avatar: require('../assets/trainer1.jpg'),
    sales: 92,
  },
];

export default function SocialLeaderboard() {
  const { theme } = useTheme();
  return (
    <View style={styles.leaderboardSection}>
      <Text
        style={[
          styles.leaderboardTitle,
          {
            color: theme.text,
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: 0.5,
            marginBottom: 10,
            textShadowColor: 'transparent',
          },
        ]}
      >
        Top Creators This Month
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={{ width: 12 }} />
        {LEADERBOARD.map((creator, idx) => (
          <View key={creator.id} style={[styles.leaderCard, idx === 0 && styles.firstPlace]}> 
            <Image source={creator.avatar} style={styles.avatar} />
            <Text style={styles.name}>{creator.name}</Text>
            <View style={styles.salesRow}>
              <Ionicons name="pricetag" size={16} color={COLORS.primary} />
              <Text style={styles.sales}>{creator.sales} sales</Text>
            </View>
            {idx === 0 && (
              <View style={styles.crown}>
                <Ionicons name="star" size={20} color="#FFD700" />
              </View>
            )}
          </View>
        ))}
        <View style={{ width: 12 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  leaderboardSection: {
    marginTop: 0,
    marginBottom: 2,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 24,
    marginLeft: 4,
  },
  leaderCard: {
    backgroundColor: '#f2f6fa',
    borderRadius: 16,
    alignItems: 'center',
    padding: 14,
    marginRight: 12,
    width: 120,
    minHeight: 140,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scrollContainer: {
    paddingVertical: 2,
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  firstPlace: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 6,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
    color: COLORS.text.primary,
  },
  salesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sales: {
    marginLeft: 4,
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  crown: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'transparent',
  },
});
