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
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const DefaultProfilePicture = ({ size = 40 }) => (
  <View style={[styles.defaultProfileImage, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={styles.sadFace}>:(</Text>
  </View>
);

const MessageCard = ({ image, name, message, time, unread, isGroup, memberCount, isPrivate }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ChatConversation', {
      otherUser: {
        name,
        image,
        status: 'online', // You might want to make this dynamic
        type: isGroup ? `Group · ${memberCount} members` : 'User',
      }
    });
  };

  return (
    <TouchableOpacity style={styles.messageCard} onPress={handlePress}>
      {image ? (
        <Image source={image} style={styles.avatar} />
      ) : (
        <DefaultProfilePicture />
      )}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
            {isPrivate && <Ionicons name="lock-closed" size={14} color={COLORS.text.secondary} style={styles.privateIcon} />}
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={[styles.message, unread && styles.unreadMessage]} numberOfLines={1}>
          {message}
        </Text>
        {isGroup && (
          <Text style={styles.memberCount}>{memberCount} members</Text>
        )}
      </View>
      {unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const CommunitySection = ({ title, communities }) => (
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

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState('messages');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigation = useNavigation();

  const messages = [
    {
      id: '1',
      name: 'Women\'s Fitness Support',
      image: require('../assets/trainer1.jpg'),
      message: "New weekly challenge: Share your favorite home workout!",
      time: '10 mins ago',
      unread: true,
      isGroup: true,
      memberCount: 128,
      isPrivate: true,
    },
    {
      id: '2',
      name: 'Beginner\'s Corner',
      image: require('../assets/trainer2.jpg'),
      message: "Welcome Sarah! Feel free to ask any questions...",
      time: '12 mins ago',
      unread: false,
      isGroup: true,
      memberCount: 256,
      isPrivate: false,
    },
    {
      id: '3',
      name: 'Emma Thompson',
      image: require('../assets/trainer1.jpg'),
      message: "Your progress is amazing! Keep up the great work 💪",
      time: '25 mins ago',
      unread: true,
      isGroup: false,
      isPrivate: true,
    },
    {
      id: '4',
      name: 'Mindful Meditation Group',
      image: require('../assets/trainer2.jpg'),
      message: "Today's meditation session starts in 30 minutes!",
      time: '45 mins ago',
      unread: false,
      isGroup: true,
      memberCount: 89,
      isPrivate: false,
    },
    {
      id: '5',
      name: 'Nutrition Support Circle',
      image: require('../assets/trainer1.jpg'),
      message: "New meal prep guide posted! Check it out in the resources tab.",
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
      name: 'Wellness Warriors',
      image: require('../assets/trainer1.jpg'),
      message: "New challenge: 30 days of mindful eating starts Monday! 🥗",
      time: 'Yesterday',
      unread: false,
      isGroup: true,
      memberCount: 423,
      isPrivate: false,
    },
    {
      id: '10',
      name: 'Sarah\'s Premium Group',
      image: require('../assets/trainer2.jpg'),
      message: "Exclusive workout video posted! Plus Q&A session tonight!",
      time: 'Yesterday',
      unread: true,
      isGroup: true,
      memberCount: 75,
      isPrivate: true,
    }
  ];

  const communities = [
    {
      id: '1',
      name: 'Confidence Building',
      image: require('../assets/trainer1.jpg'),
      members: '1.2k',
      isPrivate: true,
    },
    {
      id: '2',
      name: 'Nutrition Support',
      image: require('../assets/trainer2.jpg'),
      members: '890',
      isPrivate: true,
    },
    {
      id: '3',
      name: 'Strength Training',
      image: require('../assets/trainer1.jpg'),
      members: '2.1k',
      isPrivate: false,
    },
    {
      id: '4',
      name: 'Wellness Circle',
      image: require('../assets/trainer2.jpg'),
      members: '567',
      isPrivate: true,
    },
    {
      id: '5',
      name: 'Mental Health & Fitness',
      image: require('../assets/trainer1.jpg'),
      members: '3.2k',
      isPrivate: true,
    },
    {
      id: '6',
      name: 'Recovery & Rest',
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: COLORS.primary + '15' }]}
          onPress={() => navigation.getParent()?.navigate('SearchUsers')}
        >
          <Ionicons name="person-add-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>
            Communities
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'messages' ? "Search messages" : "Search communities"}
          placeholderTextColor={COLORS.text.secondary}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {activeTab === 'messages' ? (
          <>
            <View style={styles.filterChips}>
              <TouchableOpacity 
                style={[styles.filterChip, activeFilter === 'all' && styles.activeFilterChip]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[
                  styles.filterChipText, 
                  activeFilter === 'all' && styles.activeFilterChipText
                ]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterChip, activeFilter === 'groups' && styles.activeFilterChip]}
                onPress={() => setActiveFilter('groups')}
              >
                <Text style={[
                  styles.filterChipText, 
                  activeFilter === 'groups' && styles.activeFilterChipText
                ]}>Groups</Text>
              </TouchableOpacity>
            </View>
            {getFilteredMessages().map((message) => (
              <MessageCard key={message.id} {...message} />
            ))}
          </>
        ) : (
          <>
            <CommunitySection title="Female Wellness Groups" communities={femaleWellnessGroups} />
            <View style={styles.divider} />
            <CommunitySection title="Your Communities" communities={communities} />
            <View style={styles.divider} />
            <CommunitySection title="Fitness Goals" communities={fitnessGoalsGroups} />
            <View style={styles.divider} />
            <CommunitySection title="Nutrition & Diet" communities={nutritionAndDietGroups} />
            <View style={styles.divider} />
            <CommunitySection title="Lifestyle & Wellness" communities={lifestyleAndWellness} />
            <View style={styles.divider} />
            <CommunitySection title="Specialized Training" communities={specializedTraining} />
            <View style={styles.divider} />
            <CommunitySection title="Suggested For You" communities={suggestedCommunities} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    margin: 16,
    padding: 12,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  filterChips: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.lightGrey,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  activeFilterChipText: {
    color: COLORS.white,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginRight: 4,
  },
  privateIcon: {
    marginLeft: 4,
    color: COLORS.text.secondary,
  },
  time: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  message: {
    fontSize: 14,
    color: COLORS.text.secondary,
    flexWrap: 'wrap',
    paddingRight: 24,
  },
  unreadMessage: {
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  memberCount: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  communitySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  communityCard: {
    width: 160,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  communityImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  communityInfo: {
    padding: 12,
  },
  communityName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  communityMembers: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  privateBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.lightGrey,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  defaultProfileImage: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sadFace: {
    fontSize: 20,
    color: '#666',
    transform: [{ rotate: '90deg' }],
  },
});
