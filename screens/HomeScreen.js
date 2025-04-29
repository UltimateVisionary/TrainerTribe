import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// LIVE Q&A image asset
const LIVE_QA_IMAGE = require('../assets/LIVEQ&A.jpg');
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatbotModal from '../components/ChatbotModal';

const CreatorCard = ({ image, name, isLive, theme }) => (
  <TouchableOpacity style={[styles.creatorCard, { backgroundColor: theme.background }]}>
    <Image source={image} style={styles.creatorImage} />
    {isLive && (
      <View style={[styles.liveIndicator, { backgroundColor: theme.error }]}>
        <Text style={[styles.liveText, { color: theme.white }]}>{'LIVE'}</Text>
      </View>
    )}
    <Text style={[styles.creatorName, { color: theme.text }]} numberOfLines={1}>{name}</Text>
  </TouchableOpacity>
);

const LikeButton = ({ initialLikes, theme }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? incrementLikes(prev) : decrementLikes(prev));
    
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const incrementLikes = (current) => {
    const num = parseInt(current.replace('k', '000'));
    return formatLikes(num + 1);
  };

  const decrementLikes = (current) => {
    const num = parseInt(current.replace('k', '000'));
    return formatLikes(Math.max(0, num - 1));
  };

  const formatLikes = (num) => {
    return num >= 1000 ? (num/1000).toFixed(1) + 'k' : num.toString();
  };

  return (
    <View style={[styles.statItem, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={animateLike}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {isLiked ? (
            <LinearGradient
              colors={[theme.primary, theme.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heartGradient}
            >
              <Ionicons name="heart" size={20} color={theme.white} />
            </LinearGradient>
          ) : (
            <Ionicons name="heart-outline" size={20} color={theme.grey} />
          )}
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.statText, { color: theme.textSecondary }]}>{likes}</Text>
    </View>
  );
};

const SaveButton = ({ theme }) => {
  const [isSaved, setIsSaved] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateSave = () => {
    setIsSaved(!isSaved);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.background }]} onPress={animateSave}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={isSaved ? theme.error : theme.grey} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const PostCard = ({ creator, image, title, description, likes, comments, duration, level, theme, navigation }) => (
  <View style={[styles.postCard, { backgroundColor: theme.card }]}>
    <View style={[styles.postHeader, { backgroundColor: theme.background }]}>
      <Image source={creator.image} style={styles.creatorAvatar} />
      <View style={styles.postHeaderText}>
        <Text style={[styles.creatorTitle, { color: theme.text }]}>{creator.name}</Text>
        <Text style={[styles.postTime, { color: theme.textSecondary }]}>{'Just now'}</Text>
      </View>
      <SaveButton theme={theme} />
    </View>
    <Image source={image} style={styles.postImage} />
    <View style={[styles.postContent, { backgroundColor: theme.background }]}>
      <Text style={[styles.postTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.postDescription, { color: theme.textSecondary }]} numberOfLines={2}>{description}</Text>
      <View style={styles.postMetadata}>
        <View style={styles.metadataItem}>
          <Ionicons name="time-outline" size={16} color={theme.grey} />
          <Text style={[styles.metadataText, { color: theme.textSecondary }]}>{duration}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Ionicons name="fitness-outline" size={16} color={theme.grey} />
          <Text style={[styles.metadataText, { color: theme.textSecondary }]}>{level}</Text>
        </View>
      </View>
      <View style={styles.postStats}>
        <LikeButton initialLikes={likes} theme={theme} />
        <View style={[styles.statItem, { backgroundColor: theme.background }]}>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('CommentScreen', { postId: 'demo-post-id' })} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.grey} />
            <Text style={[styles.statText, { color: theme.textSecondary, marginLeft: 4 }]}>{comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const ProgressCard = ({ title, progress, target, theme }) => (
  <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
    <Text style={[styles.progressTitle, { color: theme.text }]}>{title}</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${(progress / target) * 100}%`, backgroundColor: theme.primary }]} />
    </View>
    <Text style={[styles.progressText, { color: theme.textSecondary }]}>{progress}/{target}</Text>
  </View>
);

const MealPlanCard = ({ title, image, calories, meals, duration, dietType, theme }) => (
  <View style={[styles.postCard, { backgroundColor: theme.card }]}>
    <View style={[styles.postHeader, { backgroundColor: theme.background }]}>
      <View style={styles.postHeaderText}>
        <Text style={[styles.postTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.postTime, { color: theme.textSecondary }]}>{duration}</Text>
      </View>
      <SaveButton theme={theme} />
    </View>
    <Image source={image} style={styles.postImage} />
    <View style={[styles.postContent, { backgroundColor: theme.background }]}>
      <View style={styles.mealPlanMetadata}>
        <View style={styles.metadataItem}>
          <Ionicons name="flame-outline" size={16} color={theme.grey} />
          <Text style={[styles.metadataText, { color: theme.textSecondary }]}>{calories} cal/day</Text>
        </View>
        <View style={styles.metadataItem}>
          <Ionicons name="restaurant-outline" size={16} color={theme.grey} />
          <Text style={[styles.metadataText, { color: theme.textSecondary }]}>{meals} meals/day</Text>
        </View>
        <View style={styles.dietTypeBadge}>
          <Text style={styles.dietTypeText}>{dietType}</Text>
        </View>
      </View>
    </View>
  </View>
);

const CategoryButton = ({ title, isActive, onPress, theme }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        isActive && { backgroundColor: theme.primary },
        !isActive && { backgroundColor: theme.card },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.categoryButtonGlow,
          { opacity: opacityAnim, backgroundColor: theme.primary },
        ]}
      />
      <Text
        style={[
          styles.categoryButtonText,
          isActive && { color: theme.white, fontWeight: '600' },
          !isActive && { color: theme.text },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { t, language, key: languageKey } = useLanguage();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const navigation = useNavigation();
  
  const creators = [
    { id: '1', name: 'The Sculpted Vegan', image: require('../assets/trainer1.jpg'), isLive: true },
    { id: '2', name: "Laura's Fitness", image: require('../assets/trainer2.jpg'), isLive: false },
    { id: '3', name: 'Mike Chen', image: require('../assets/trainer1.jpg'), isLive: true },
    { id: '4', name: 'Sarah Johnson', image: require('../assets/trainer2.jpg'), isLive: false },
  ];

  const posts = [
    {
      type: 'video',
      creator: {
        name: "Train With Suzie",
        image: require('../assets/trainer1.jpg')
      },
      image: require('../assets/trainer1.jpg'),
      title: "30-Minute Full Body HIIT",
      description: "Perfect for beginners! This low-impact HIIT session focuses on form and building confidence. No equipment needed.",
      likes: "1.2k",
      comments: "122",
      duration: "30 min",
      level: "Beginner"
    },
    {
      type: 'video',
      creator: {
        name: "Mike's Fitness",
        image: require('../assets/trainer2.jpg')
      },
      image: require('../assets/trainer2.jpg'),
      title: "Advanced Core Workout",
      description: "Challenge your core with this intense 45-minute workout. Requires a mat and some light weights.",
      likes: "856",
      comments: "98",
      duration: "45 min",
      level: "Advanced"
    },
    {
      type: 'image',
      creator: {
        name: "FitnessPro",
        image: require('../assets/trainer1.jpg')
      },
      image: require('../assets/trainer1.jpg'),
      title: "Perfect Squat Form Guide",
      description: "Master the perfect squat with our detailed form guide. Swipe through for step-by-step instructions.",
      likes: "2.3k",
      comments: "156",
      level: "All Levels"
    },
    {
      type: 'image',
      creator: {
        name: "Yoga with Laura",
        image: require('../assets/trainer2.jpg')
      },
      image: require('../assets/trainer2.jpg'),
      title: "Morning Stretching Routine",
      description: "Start your day right with these 10 essential stretches. Perfect for improving flexibility and reducing muscle tension.",
      likes: "1.8k",
      comments: "143",
      level: "Beginner"
    }
  ];

  const mealPlans = [
    {
      type: 'nutrition',
      title: "7-Day Weight Loss Meal Plan",
      image: require('../assets/trainer1.jpg'),
      calories: "1800",
      meals: "5",
      duration: "7 days",
      dietType: "Balanced"
    },
    {
      type: 'nutrition',
      title: "Muscle Building Meal Plan",
      image: require('../assets/trainer2.jpg'),
      calories: "2500",
      meals: "6",
      duration: "30 days",
      dietType: "High Protein"
    },
    {
      type: 'nutrition',
      title: "Plant-Based Wellness Plan",
      image: require('../assets/trainer1.jpg'),
      calories: "2000",
      meals: "4",
      duration: "14 days",
      dietType: "Vegan"
    }
  ];

  const getFilteredContent = () => {
    if (activeCategory === 'all') {
      return [...posts, ...mealPlans];
    } else if (activeCategory === 'videos') {
      return posts.filter(post => post.type === 'video');
    } else if (activeCategory === 'images') {
      return posts.filter(post => post.type === 'image');
    } else if (activeCategory === 'nutrition') {
      return mealPlans;
    }
    return [];
  };

  const renderContent = (item) => {
    if (item.type === 'nutrition') {
      return <MealPlanCard key={item.title} {...item} theme={theme} />;
    }
    return <PostCard key={item.title} {...item} theme={theme} navigation={navigation} />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} key={languageKey}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.grey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchAllCreators')}
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Live Creators */}
        <View style={styles.creatorsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('liveNow')}</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllButton, { color: theme.primary }]}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {creators.map((creator) => (
              <CreatorCard key={creator.id} {...creator} theme={theme} />
            ))}
          </ScrollView>
        </View>

        {/* LIVE Q&A Banner */}

        {/* Daily Progress Section */}
        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('todaysProgress')}</Text>
          <View style={styles.progressContainer}>
            <ProgressCard title={t('dailyWorkoutGoal')} progress={2} target={3} theme={theme} />
            <ProgressCard title={t('weeklyStreak')} progress={5} target={7} theme={theme} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <CategoryButton
              title={t('allContent')}
              isActive={activeCategory === 'all'}
              onPress={() => setActiveCategory('all')}
              theme={theme}
            />
            <CategoryButton
              title={t('videos')}
              isActive={activeCategory === 'videos'}
              onPress={() => setActiveCategory('videos')}
              theme={theme}
            />
            <CategoryButton
              title={t('images')}
              isActive={activeCategory === 'images'}
              onPress={() => setActiveCategory('images')}
              theme={theme}
            />
            <CategoryButton
              title={t('nutrition')}
              isActive={activeCategory === 'nutrition'}
              onPress={() => setActiveCategory('nutrition')}
              theme={theme}
            />
          </ScrollView>
        </View>

        {/* Feed */}
        <View style={styles.feedContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('forYou')}</Text>
          {getFilteredContent().map(item => renderContent(item))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={async () => {
          // Play sound effect before showing chatbot
          const { playChatbotSound } = await import('../utils/sound');
          playChatbotSound();
          setIsChatbotVisible(true);
        }}
      >
        <LinearGradient
          colors={[theme.primary, '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={theme.white} />
        </LinearGradient>
      </TouchableOpacity>

      <ChatbotModal
        visible={isChatbotVisible}
        onClose={() => setIsChatbotVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginRight: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  progressSection: {
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4169E1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
  },
  categoriesContainer: {
    paddingVertical: 14,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    marginHorizontal: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  categoryButtonActive: {
    backgroundColor: '#4169E1',
  },
  categoryButtonGlow: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4169E1',
  },
  creatorsContainer: {
    paddingVertical: 16,
    paddingTop: 20,
  },
  creatorCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
    marginTop: 8,
    paddingTop: 4,
  },
  creatorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  liveIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  creatorName: {
    fontSize: 12,
  },
  feedContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  creatorTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
  },
  saveButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postDescription: {
    fontSize: 14,
  },
  postMetadata: {
    flexDirection: 'row',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    marginLeft: 4,
    fontSize: 14,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
  mealPlanMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dietTypeBadge: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dietTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  heartGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});
