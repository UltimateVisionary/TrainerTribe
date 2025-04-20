import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const HeartbeatIcon = () => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Ionicons 
      name="heart" 
      size={22} 
      color={COLORS.primary}
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

const WorkoutCategoryCard = ({ title, count, icon, onPress }) => {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'strength':
        return <Ionicons name="barbell-outline" size={22} color={COLORS.primary} />;
      case 'cardio':
        return <Ionicons name="bicycle-outline" size={22} color={COLORS.primary} />;
      case 'yoga':
        return <Ionicons name="heart" size={22} color={COLORS.primary} />;
      case 'hiit':
        return <Ionicons name="flash-outline" size={22} color={COLORS.primary} />;
      default:
        return <Ionicons name="fitness-outline" size={22} color={COLORS.primary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count} workouts</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
});

export default WorkoutCategoryCard; 