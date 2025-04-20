import React, { useState, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import ChatbotModal from '../components/ChatbotModal';
import { useNavigation } from '@react-navigation/native';

const CreatorCard = ({ image, name, isLive }) => (
  <TouchableOpacity style={styles.creatorCard}>
    <Image source={image} style={styles.creatorImage} />
    {isLive && (
      <View style={styles.liveIndicator}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    )}
    <Text style={styles.creatorName} numberOfLines={1}>{name}</Text>
  </TouchableOpacity>
);

const LikeButton = ({ initialLikes }) => {
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
    <View style={styles.statItem}>
      <TouchableOpacity onPress={animateLike}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {isLiked ? (
            <LinearGradient
              colors={['#4169E1', '#60A5FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heartGradient}
            >
              <Ionicons name="heart" size={20} color="white" />
            </LinearGradient>
          ) : (
            <Ionicons name="heart-outline" size={20} color="#666" />
          )}
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.statText}>{likes}</Text>
    </View>
  );
};

const SaveButton = () => {
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
    <TouchableOpacity style={styles.saveButton} onPress={animateSave}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={isSaved ? COLORS.error : "#666"} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const PostCard = ({ creator, image, title, description, likes, comments, duration, level }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <Image source={creator.image} style={styles.creatorAvatar} />
      <View style={styles.postHeaderText}>
        <Text style={styles.creatorTitle}>{creator.name}</Text>
        <Text style={styles.postTime}>Just now</Text>
      </View>
      <SaveButton />
    </View>
    <Image source={image} style={styles.postImage} />
    <View style={styles.postContent}>
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDescription} numberOfLines={2}>{description}</Text>
      <View style={styles.postMetadata}>
        <View style={styles.metadataItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.metadataText}>{duration}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Ionicons name="fitness-outline" size={16} color="#666" />
          <Text style={styles.metadataText}>{level}</Text>
        </View>
      </View>
      <View style={styles.postStats}>
        <LikeButton initialLikes={likes} />
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.statText}>{comments}</Text>
        </View>
      </View>
    </View>
  </View>
);

const ProgressCard = ({ title, progress, target }) => (
  <View style={styles.progressCard}>
    <Text style={styles.progressTitle}>{title}</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${(progress / target) * 100}%` }]} />
    </View>
    <Text style={styles.progressText}>{progress}/{target}</Text>
  </View>
);

const MealPlanCard = ({ title, image, calories, meals, duration, dietType }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <View style={styles.postHeaderText}>
        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.postTime}>{duration}</Text>
      </View>
      <SaveButton />
    </View>
    <Image source={image} style={styles.postImage} />
    <View style={styles.postContent}>
      <View style={styles.mealPlanMetadata}>
        <View style={styles.metadataItem}>
          <Ionicons name="flame-outline" size={16} color="#666" />
          <Text style={styles.metadataText}>{calories} cal/day</Text>
        </View>
        <View style={styles.metadataItem}>
          <Ionicons name="restaurant-outline" size={16} color="#666" />
          <Text style={styles.metadataText}>{meals} meals/day</Text>
        </View>
        <View style={styles.dietTypeBadge}>
          <Text style={styles.dietTypeText}>{dietType}</Text>
        </View>
      </View>
    </View>
  </View>
);

const CategoryButton = ({ title, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateHover = (isPressing) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isPressing ? 0.95 : 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isPressing ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <Pressable
      onPressIn={() => animateHover(true)}
      onPressOut={() => animateHover(false)}
      onPress={onPress}
      style={styles.categoryButtonWrapper}
    >
      <Animated.View
        style={[
          styles.categoryButton,
          isActive && styles.categoryButtonActive,
          {
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.categoryButtonGlow,
            { opacity: opacityAnim }
          ]}
        >
          <LinearGradient
            colors={['rgba(65, 105, 225, 0.2)', 'rgba(96, 165, 250, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Text
          style={[
            styles.categoryButtonText,
            isActive && styles.categoryButtonTextActive
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function HomeScreen() {
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
      return <MealPlanCard key={item.title} {...item} />;
    }
    return <PostCard key={item.title} {...item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.grey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search all creators"
            placeholderTextColor={COLORS.text.primary}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Live Creators */}
        <View style={styles.creatorsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {creators.map((creator) => (
              <CreatorCard key={creator.id} {...creator} />
            ))}
          </ScrollView>
        </View>

        {/* Daily Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressContainer}>
            <ProgressCard title="Daily Workout Goal" progress={2} target={3} />
            <ProgressCard title="Weekly Streak" progress={5} target={7} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <CategoryButton
              title="All"
              isActive={activeCategory === 'all'}
              onPress={() => setActiveCategory('all')}
            />
            <CategoryButton
              title="Videos"
              isActive={activeCategory === 'videos'}
              onPress={() => setActiveCategory('videos')}
            />
            <CategoryButton
              title="Images"
              isActive={activeCategory === 'images'}
              onPress={() => setActiveCategory('images')}
            />
            <CategoryButton
              title="Nutrition"
              isActive={activeCategory === 'nutrition'}
              onPress={() => setActiveCategory('nutrition')}
            />
          </ScrollView>
        </View>

        {/* Feed */}
        <View style={styles.feedContainer}>
          <Text style={styles.sectionTitle}>For You</Text>
          {getFilteredContent().map(item => renderContent(item))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => setIsChatbotVisible(true)}
      >
        <LinearGradient
          colors={[COLORS.primary, '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.white} />
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
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 10,
    marginRight: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
    color: COLORS.grey,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.text.primary,
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
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  categoriesContainer: {
    paddingVertical: 14,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryButtonWrapper: {
    marginHorizontal: 6,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.lightGrey,
    overflow: 'hidden',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonGlow: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  categoryButtonText: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
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
    color: COLORS.text.primary,
  },
  seeAllButton: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  liveText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  creatorName: {
    fontSize: 12,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  feedContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.grey,
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
    color: COLORS.text.primary,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.text.secondary,
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
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  postMetadata: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
    color: COLORS.text.secondary,
  },
  mealPlanMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dietTypeBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dietTypeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
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
