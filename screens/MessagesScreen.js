import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const DefaultProfilePicture = ({ size = 40, theme }) => {
  const styles = StyleSheet.create({
    defaultProfileImage: {
      backgroundColor: theme.card,
      justifyContent: 'center',
      alignItems: 'center',
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    sadFace: {
      fontSize: 20,
      color: theme.textSecondary,
      transform: [{ rotate: '90deg' }],
    },
  });
  return (
    <View style={styles.defaultProfileImage}>
      <Text style={styles.sadFace}>:(</Text>
    </View>
  );
};

const MessageCard = ({ image, name, message, time, unread, isGroup, memberCount, isPrivate, theme }) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    messageCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border, backgroundColor: theme.background },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.card },
    messageContent: { flex: 1, marginLeft: 12, marginRight: 8 },
    messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    nameContainer: { flexDirection: 'row', alignItems: 'center' },
    name: { fontSize: 16, fontWeight: '600', color: theme.text, marginRight: 4 },
    privateIcon: { marginLeft: 4, color: theme.textSecondary },
    time: { fontSize: 12, color: theme.textSecondary },
    message: { fontSize: 14, color: theme.textSecondary, flexWrap: 'wrap', paddingRight: 24 },
    unreadMessage: { color: theme.text, fontWeight: '500' },
    memberCount: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary, marginLeft: 8 },
  });
  const handlePress = () => {
    navigation.navigate('ChatConversation', {
      otherUser: {
        name,
        image,
        status: 'online', // You might want to make this dynamic
        type: isGroup ? `${t('group')} · ${memberCount} ${t('members')}` : t('user'),
      }
    });
  };
  return (
    <TouchableOpacity style={styles.messageCard} onPress={handlePress}>
      {image ? (
        <Image source={image} style={styles.avatar} />
      ) : (
        <DefaultProfilePicture theme={theme} />
      )}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{[
              'womensFitnessSupport',
              'beginnersCorner',
              'emmaThompson',
              'mindfulMeditationGroup',
              'nutritionSupportCircle',
              'wellnessWarriors',
              'sarahsPremiumGroup'
            ].includes(name) ? t(name) : name}</Text>
            {isPrivate && <Ionicons name="lock-closed" size={14} color={theme.textSecondary} style={styles.privateIcon} />}
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={[styles.message, unread && styles.unreadMessage]} numberOfLines={1}>
          {[
            'newWeeklyChallenge',
            'welcomeSarah',
            'yourProgressAmazing',
            'todaysMeditationStarted',
            'newMealPrepGuide',
            'newMindfulEatingChallenge',
            'exclusiveWorkoutVideoPosted'
          ].includes(message) ? t(message) : message}
        </Text>
        {isGroup && (
          <Text style={styles.memberCount}>{memberCount} {t('members')}</Text>
        )}
      </View>
      {unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const CommunitySection = ({ title, communities, theme }) => {
  const styles = StyleSheet.create({
    communitySection: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 12 },
    communityCard: { width: 160, backgroundColor: theme.card, borderRadius: 12, marginRight: 12, shadowColor: theme.shadow || '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: 'hidden' },
    communityImage: { width: '100%', height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    communityInfo: { padding: 12 },
    communityName: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 4 },
    communityMembers: { fontSize: 12, color: theme.textSecondary },
    privateBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  });
  return (
    <View style={styles.communitySection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {communities.map((community) => (
          <TouchableOpacity key={community.id} style={styles.communityCard}>
            <Image source={community.image} style={styles.communityImage} />
            <View style={styles.communityInfo}>
              <Text style={styles.communityName}>{community.name}</Text>
              <Text style={styles.communityMembers}>{community.members} members</Text>
            </View>
            {community.isPrivate && (
              <View style={styles.privateBadge}>
                <Ionicons name="lock-closed" size={12} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

import { useMemo } from 'react';

export default function MessagesScreen() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('messages');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigation = useNavigation();

  const RAW_MESSAGES = [
    {
      id: '1',
      name: 'womensFitnessSupport',
      image: require('../assets/trainer1.jpg'),
      message: 'newWeeklyChallenge',
      time: '10 mins ago',
      unread: true,
      isGroup: true,
      memberCount: 128,
      isPrivate: true,
    },
    {
      id: '2',
      name: 'beginnersCorner',
      image: require('../assets/trainer2.jpg'),
      message: 'welcomeSarah',
      time: '12 mins ago',
      unread: false,
      isGroup: true,
      memberCount: 256,
      isPrivate: false,
    },
    {
      id: '3',
      name: 'emmaThompson',
      image: require('../assets/trainer1.jpg'),
      message: 'yourProgressAmazing',
      time: '25 mins ago',
      unread: true,
      isGroup: false,
      isPrivate: true,
    },
    {
      id: '4',
      name: 'mindfulMeditationGroup',
      image: require('../assets/trainer2.jpg'),
      message: 'todaysMeditationStarted',
      time: '45 mins ago',
      unread: false,
      isGroup: true,
      memberCount: 89,
      isPrivate: false,
    },
    {
      id: '5',
      name: 'nutritionSupportCircle',
      image: require('../assets/trainer1.jpg'),
      message: 'newMealPrepGuide',
      time: '1 hour ago',
      unread: true,
      isGroup: true,
      memberCount: 312,
      isPrivate: true,
    },
    {
      id: '6',
      name: 'Lisa Chen',
      image: require('../assets/trainer2.jpg'),
      message: "Thanks for the form check tips! Really helped with my squats.",
      time: '2 hours ago',
      unread: false,
      isGroup: false,
      isPrivate: true,
    },
    {
      id: '7',
      name: 'Morning Yoga Flow',
      image: require('../assets/trainer1.jpg'),
      message: "Rise and shine! 🌅 Tomorrow's session: Vinyasa Flow",
      time: '3 hours ago',
      unread: false,
      isGroup: true,
      memberCount: 156,
      isPrivate: false,
    },
    {
      id: '8',
      name: 'Maria Rodriguez',
      image: require('../assets/trainer2.jpg'),
      message: "Can we schedule a 1-on-1 session next week?",
      time: '4 hours ago',
      unread: true,
      isGroup: false,
      isPrivate: true,
    },
    {
      id: '9',
      name: 'wellnessWarriors',
      image: require('../assets/trainer1.jpg'),
      message: 'newMindfulEatingChallenge',
      time: 'Yesterday',
      unread: false,
      isGroup: true,
      memberCount: 423,
      isPrivate: false,
    },
    {
      id: '10',
      name: 'sarahsPremiumGroup',
      image: require('../assets/trainer2.jpg'),
      message: 'exclusiveWorkoutVideoPosted',
      time: 'Yesterday',
      unread: true,
      isGroup: true,
      memberCount: 75,
      isPrivate: true,
    }
  ];

  const messages = RAW_MESSAGES;

  const RAW_COMMUNITIES = [
    {
      id: '1',
      name: 'confidenceBuilding',
      image: require('../assets/trainer1.jpg'),
      members: '1.2k',
      isPrivate: true,
    },
    {
      id: '2',
      name: 'nutritionSupport',
      image: require('../assets/trainer2.jpg'),
      members: '890',
      isPrivate: true,
    },
    {
      id: '3',
      name: 'strengthTraining',
      image: require('../assets/trainer1.jpg'),
      members: '2.1k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'wellnessCircle',
      image: require('../assets/trainer2.jpg'),
      members: '567',
      isPrivate: true,
    },
    {
      id: '5',
      name: 'mentalHealthFitness',
      image: require('../assets/trainer1.jpg'),
      members: '3.2k',
      isPrivate: true,
    },
    {
      id: '6',
      name: 'recoveryRest',
      image: require('../assets/trainer2.jpg'),
      members: '1.5k',
      isPrivate: false,
    }
  ];

  const suggestedCommunities = [
    {
      id: '1',
      name: 'Mindful Movement',
      image: require('../assets/trainer1.jpg'),
      members: '567',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Home Workout Heroes',
      image: require('../assets/trainer2.jpg'),
      members: '1.5k',
      isPrivate: false,
    },
    {
      id: '3',
      name: 'Yoga Enthusiasts',
      image: require('../assets/trainer1.jpg'),
      members: '3.2k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Healthy Recipes',
      image: require('../assets/trainer2.jpg'),
      members: '982',
      isPrivate: false,
    },
    {
      id: '5',
      name: 'HIIT Warriors',
      image: require('../assets/trainer1.jpg'),
      members: '2.8k',
      isPrivate: false,
    },
    {
      id: '6',
      name: 'Meditation Circle',
      image: require('../assets/trainer2.jpg'),
      members: '1.1k',
      isPrivate: false,
    },
    {
      id: '7',
      name: 'Flexibility & Mobility',
      image: require('../assets/trainer1.jpg'),
      members: '945',
      isPrivate: false,
    },
    {
      id: '8',
      name: 'Dance Fitness',
      image: require('../assets/trainer2.jpg'),
      members: '2.4k',
      isPrivate: false,
    }
  ];

  const femaleWellnessGroups = [
    {
      id: '1',
      name: 'Women Supporting Women',
      image: require('../assets/trainer1.jpg'),
      members: '2.3k',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Ladies Lift Together',
      image: require('../assets/trainer2.jpg'),
      members: '1.8k',
      isPrivate: false,
    },
    {
      id: '3',
      name: 'Girl Power Fitness',
      image: require('../assets/trainer1.jpg'),
      members: '3.4k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Moms in Fitness',
      image: require('../assets/trainer2.jpg'),
      members: '1.2k',
      isPrivate: true,
    },
    {
      id: '5',
      name: 'Body Positivity Queens',
      image: require('../assets/trainer1.jpg'),
      members: '4.2k',
      isPrivate: false,
    },
    {
      id: '6',
      name: 'Pregnancy Fitness',
      image: require('../assets/trainer2.jpg'),
      members: '892',
      isPrivate: true,
    }
  ];

  const fitnessGoalsGroups = [
    {
      id: '1',
      name: 'Weight Loss Journey',
      image: require('../assets/trainer1.jpg'),
      members: '5.6k',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Muscle Building',
      image: require('../assets/trainer2.jpg'),
      members: '3.2k',
      isPrivate: false,
    },
    {
      id: '3',
      name: 'Marathon Training',
      image: require('../assets/trainer1.jpg'),
      members: '2.1k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Transformation Stories',
      image: require('../assets/trainer2.jpg'),
      members: '4.3k',
      isPrivate: false,
    }
  ];

  const nutritionAndDietGroups = [
    {
      id: '1',
      name: 'Meal Prep Masters',
      image: require('../assets/trainer1.jpg'),
      members: '2.8k',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Vegan Fitness',
      image: require('../assets/trainer2.jpg'),
      members: '1.9k',
      isPrivate: false,
    },
    {
      id: '3',
      name: 'Intuitive Eating',
      image: require('../assets/trainer1.jpg'),
      members: '1.5k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Macro Tracking',
      image: require('../assets/trainer2.jpg'),
      members: '2.2k',
      isPrivate: false,
    }
  ];

  const lifestyleAndWellness = [
    {
      id: '1',
      name: 'Work-Life Balance',
      image: require('../assets/trainer1.jpg'),
      members: '3.1k',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Sleep Optimization',
      image: require('../assets/trainer2.jpg'),
      members: '1.7k',
      isPrivate: false,
    },
    {
      id: '3',
      name: 'Stress Management',
      image: require('../assets/trainer1.jpg'),
      members: '2.9k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Self-Care Sunday',
      image: require('../assets/trainer2.jpg'),
      members: '2.4k',
      isPrivate: false,
    }
  ];

  const specializedTraining = [
    {
      id: '1',
      name: 'Calisthenics Crew',
      image: require('../assets/trainer1.jpg'),
      members: '1.8k',
      isPrivate: false,
    },
    {
      id: '2',
      name: 'Powerlifting Pro',
      image: require('../assets/trainer2.jpg'),
      members: '2.3k',
      isPrivate: false,
    },
    {
      id: '3',
      name: 'CrossFit Community',
      image: require('../assets/trainer1.jpg'),
      members: '3.5k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Boxing Basics',
      image: require('../assets/trainer2.jpg'),
      members: '1.4k',
      isPrivate: false,
    }
  ];

  const getFilteredMessages = () => {
    switch (activeFilter) {
      case 'groups':
        return messages.filter(message => message.isGroup);
      default:
        return messages;
    }
  };

  const themedStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border },
    title: { fontSize: 24, fontWeight: '600', color: theme.text },
    searchButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    tabContainer: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 8, marginHorizontal: 4, borderRadius: 20 },
    activeTab: { backgroundColor: theme.primaryLight },
    tabText: { fontSize: 16, color: theme.textSecondary, fontWeight: '500' },
    activeTabText: { color: theme.primary },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, margin: 16, padding: 12, borderRadius: 10 },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 16, color: theme.text },
    filterChips: { flexDirection: 'row', padding: 16, paddingTop: 0 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: theme.card, marginRight: 8 },
    activeFilterChip: { backgroundColor: theme.primary },
    filterChipText: { color: theme.textSecondary, fontSize: 14 },
    activeFilterChipText: { color: theme.white },
    divider: { height: 8, backgroundColor: theme.card },
    scrollContainer: { paddingBottom: 100 },
  });

  return (
    <SafeAreaView style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>{activeTab === 'messages' ? 'Messages' : 'Communities'}</Text>
        <TouchableOpacity 
          style={[themedStyles.searchButton, { backgroundColor: theme.primary + '15' }]}
          onPress={() => navigation.getParent()?.navigate('SearchUsers')}
        >
          <Ionicons name="person-add-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={themedStyles.tabContainer}>
        <TouchableOpacity 
          style={[themedStyles.tab, activeTab === 'messages' && themedStyles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[themedStyles.tabText, activeTab === 'messages' && themedStyles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[themedStyles.tab, activeTab === 'communities' && themedStyles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[themedStyles.tabText, activeTab === 'communities' && themedStyles.activeTabText]}>
            Communities
          </Text>
        </TouchableOpacity>
      </View>

      <View style={themedStyles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={themedStyles.searchIcon} />
        <TextInput
          style={themedStyles.searchInput}
          placeholder={activeTab === 'messages' ? "Search messages" : "Search communities"}
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themedStyles.scrollContainer}
      >
        {activeTab === 'messages' ? (
          <>
            <View style={themedStyles.filterChips}>
              <TouchableOpacity 
                style={[themedStyles.filterChip, activeFilter === 'all' && themedStyles.activeFilterChip]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[
                  themedStyles.filterChipText, 
                  activeFilter === 'all' && themedStyles.activeFilterChipText
                ]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[themedStyles.filterChip, activeFilter === 'groups' && themedStyles.activeFilterChip]}
                onPress={() => setActiveFilter('groups')}
              >
                <Text style={[
                  themedStyles.filterChipText, 
                  activeFilter === 'groups' && themedStyles.activeFilterChipText
                ]}>Groups</Text>
              </TouchableOpacity>
            </View>
            {getFilteredMessages().map((message) => (
              <MessageCard key={message.id} {...message} theme={theme} />
            ))}
          </>
        ) : (
          <>
            <CommunitySection title="Your Communities" communities={RAW_COMMUNITIES} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Suggested For You" communities={suggestedCommunities} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Female Wellness Groups" communities={femaleWellnessGroups} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Fitness Goals" communities={fitnessGoalsGroups} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Nutrition & Diet" communities={nutritionAndDietGroups} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Lifestyle & Wellness" communities={lifestyleAndWellness} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Specialized Training" communities={specializedTraining} theme={theme} />
            <View style={themedStyles.divider} />
            <CommunitySection title="Suggested For You" communities={suggestedCommunities} theme={theme} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
