import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

const HeartbeatIcon = () => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Ionicons 
      name="heart" 
      size={22} 
      color={useTheme().theme.primary}
      style={{ position: 'absolute' }}
    />
    <View style={{
      width: 22,
      height: 2,
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: 16,
        height: 2,
        backgroundColor: 'white',
        transform: [
          { translateX: -4 },
          { rotate: '30deg' }
        ]
      }} />
      <View style={{
        width: 16,
        height: 2,
        backgroundColor: 'white',
        transform: [
          { translateX: 4 },
          { rotate: '-30deg' }
        ]
      }} />
    </View>
  </View>
);

const CATEGORY_ICONS = {
  strength: 'barbell-outline',
  cardio: 'bicycle-outline',
  yoga: 'heart',
  hiit: 'flash-outline',
};

const WorkoutCategoryCard = ({ title, count, categoryKey, onPress }) => {
  const { theme } = useTheme();
  const iconName = CATEGORY_ICONS[categoryKey] || 'fitness-outline';

  const themedStyles = StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      marginHorizontal: 6,
      flexDirection: 'row',
      alignItems: 'center',
      width: '47%',
      shadowColor: theme.shadow || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    count: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    textContainer: { flex: 1 },
  });

  return (
    <TouchableOpacity
      style={themedStyles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={themedStyles.iconContainer}>
        <Ionicons name={iconName} size={22} color={theme.primary} />
      </View>
      <View style={themedStyles.textContainer}>
        <Text style={themedStyles.categoryTitle}>{title}</Text>
        <Text style={themedStyles.count}>{count} workouts</Text>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutCategoryCard; 