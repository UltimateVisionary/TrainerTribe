import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import ChatbotModal from '../components/ChatbotModal';
import WorkoutCategoryCard from '../components/WorkoutCategoryCard';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

  const animateLike = () => {
    setIsLiked(!isLiked);
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

    Animated.timing(fillAnim, {
      toValue: isLiked ? 0 : 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const fillInterpolation = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#4169E1']
  });

  return (
    <TouchableOpacity 
      style={styles.likeButton}
      onPress={animateLike}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={isLiked ? ['#4169E1', '#60A5FA'] : ['transparent', 'transparent']}
          style={[StyleSheet.absoluteFill, styles.gradientFill]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          size={24} 
          color={isLiked ? "transparent" : "#4169E1"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ContentCard = ({ image, title, type, creator, duration, level }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  const animatePress = (pressed) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: pressed ? 0.98 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: pressed ? 1 : 0.6,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={() => animatePress(true)}
      onPressOut={() => animatePress(false)}
      style={styles.contentWrapper}
    >
      <LinearGradient
        colors={['#4169E1', '#60A5FA', '#4169E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <Animated.View
          style={[
            styles.contentCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={image} style={styles.contentImage} />
          <View style={styles.contentBadge}>
            <Text style={styles.badgeText}>{type}</Text>
          </View>
          {duration && (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          )}
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle} numberOfLines={2}>{title}</Text>
            <View style={styles.creatorInfo}>
              <Image source={creator.image} style={styles.creatorAvatar} />
              <Text style={styles.creatorName} numberOfLines={1}>{creator.name}</Text>
            </View>
            {level && (
              <View style={styles.levelIndicator}>
                <Text style={styles.levelText}>{level}</Text>
              </View>
            )}
          </View>
          <Animated.View
            style={[
              styles.gradientOverlay,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(65, 105, 225, 0.1)', 'rgba(96, 165, 250, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
};

const CategoryCard = ({ icon, title, count }) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  const animatePress = (pressed) => {
    setIsPressed(pressed);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: pressed ? 0.98 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: pressed ? 1 : 0.6,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={() => animatePress(true)}
      onPressOut={() => animatePress(false)}
      style={styles.categoryWrapper}
    >
      <LinearGradient
        colors={['#4169E1', '#60A5FA', '#4169E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <Animated.View
          style={[
            styles.categoryCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.categoryIcon}>
            <Ionicons name={icon} size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categoryCount}>{count} workouts</Text>
          <Animated.View
            style={[
              styles.gradientOverlay,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(65, 105, 225, 0.1)', 'rgba(96, 165, 250, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
};

const TrainerCard = ({ image, name, specialty, rating }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  const animatePress = (pressed) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: pressed ? 0.98 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: pressed ? 1 : 0.6,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={() => animatePress(true)}
      onPressOut={() => animatePress(false)}
      style={styles.trainerWrapper}
    >
      <LinearGradient
        colors={['#4169E1', '#60A5FA', '#4169E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <Animated.View
          style={[
            styles.trainerCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={image} style={styles.trainerImage} />
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>{name}</Text>
            <Text style={styles.trainerSpecialty}>{specialty}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
          <LikeButton style={styles.trainerLikeButton} />
          <Animated.View
            style={[
              styles.gradientOverlay,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(65, 105, 225, 0.1)', 'rgba(96, 165, 250, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
};

const RecommendedWorkout = ({ image, title, duration, calories, level }) => (
  <TouchableOpacity style={styles.recommendedCard}>
    <Image source={image} style={styles.recommendedImage} />
    <View style={styles.recommendedInfo}>
      <Text style={styles.recommendedTitle}>{title}</Text>
      <View style={styles.recommendedMetadata}>
        <View style={styles.metadataItem}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.metadataText}>{duration}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Ionicons name="flame-outline" size={14} color="#666" />
          <Text style={styles.metadataText}>{calories} cal</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const CategoryRow = ({ categories }) => (
  <View style={styles.categoryRow}>
    {categories.map((category) => (
      <CategoryCard key={`category-${category.id}`} {...category} />
    ))}
  </View>
);

const AnimatedArrow = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, []);

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15]
  });

  return (
    <Animated.View style={[styles.arrowContainer, { transform: [{ translateY }] }]}>
      <Ionicons name="chevron-down" size={32} color="#4169E1" />
    </Animated.View>
  );
};

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const workouts = [
    {
      id: 'workout-1',
      type: 'workout',
      title: 'Full Body HIIT Workout',
      duration: '45 min',
      calories: '400',
      level: 'Intermediate',
      image: require('../assets/trainer1.jpg'),
      creator: {
        name: 'The Sculpted Vegan',
        image: require('../assets/trainer1.jpg'),
      },
    },
    {
      id: 'workout-2',
      type: 'workout',
      title: 'Core Strength Basics',
      duration: '30 min',
      calories: '250',
      level: 'Beginner',
      image: require('../assets/trainer2.jpg'),
      creator: {
        name: "Laura's Fitness",
        image: require('../assets/trainer2.jpg'),
      },
    },
  ];

  const programs = [
    {
      id: 'program-1',
      type: 'program',
      title: '30-Day Yoga Challenge',
      duration: '30 days',
      level: 'All Levels',
      image: require('../assets/trainer2.jpg'),
      creator: {
        name: "Laura's Fitness",
        image: require('../assets/trainer2.jpg'),
      },
    },
    {
      id: 'program-2',
      type: 'program',
      title: '8-Week Body Transform',
      duration: '8 weeks',
      level: 'Advanced',
      image: require('../assets/trainer1.jpg'),
      creator: {
        name: 'The Sculpted Vegan',
        image: require('../assets/trainer1.jpg'),
      },
    },
  ];

  const nutritionContent = [
    {
      id: 'nutrition-1',
      type: 'nutrition',
      title: 'Meal Prep Basics',
      duration: '7 days',
      calories: '2000/day',
      level: 'Beginner',
      image: require('../assets/trainer1.jpg'),
      creator: {
        name: 'Nutrition Pro',
        image: require('../assets/trainer1.jpg'),
      },
    },
    {
      id: 'nutrition-2',
      type: 'nutrition',
      title: 'Plant-Based Meal Plan',
      duration: '14 days',
      calories: '1800/day',
      level: 'Intermediate',
      image: require('../assets/trainer2.jpg'),
      creator: {
        name: 'Vegan Kitchen',
        image: require('../assets/trainer2.jpg'),
      },
    },
  ];

  const categories = [
    { title: 'Strength', count: 128 },
    { title: 'Cardio', count: 95 },
    { title: 'Yoga', count: 89 },
    { title: 'HIIT', count: 76 },
  ];

  const featuredTrainers = [
    {
      id: 'trainer-1',
      name: 'Sarah Johnson',
      specialty: 'HIIT & Strength',
      rating: '4.9',
      image: require('../assets/trainer1.jpg'),
    },
    {
      id: 'trainer-2',
      name: 'Mike Chen',
      specialty: 'Yoga & Mindfulness',
      rating: '4.8',
      image: require('../assets/trainer2.jpg'),
    },
  ];

  const getFilteredContent = () => {
    switch (activeFilter) {
      case 'workouts':
        return workouts;
      case 'programs':
        return programs;
      case 'nutrition':
        return nutritionContent;
      default:
        return [...workouts, ...programs, ...nutritionContent];
    }
  };

  const renderContent = (item) => {
    return (
      <View style={styles.trendingCard} key={`card-${item.id}`}>
        <ContentCard
          key={`content-${item.id}`}
          image={item.image}
          title={item.title}
          type={item.type.toUpperCase()}
          creator={item.creator}
          duration={item.duration}
          level={item.level}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.trainerTribeBanner}>
          <Image 
            source={require('../assets/trainer-tribe-banner.jpg')} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>TrainerTribe</Text>
              <Text style={styles.taglineText}>Discover the{'\n'}perfect trainer,{'\n'}find your tribe today!</Text>
            </View>
            <View style={styles.connectContainer}>
              <AnimatedArrow />
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Discover Your Next Workout</Text>
          <Text style={styles.welcomeSubtitle}>Find the perfect workout for your goals</Text>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'all' && styles.filterButtonTextActive]}>
                All Content
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'workouts' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('workouts')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'workouts' && styles.filterButtonTextActive]}>
                Workouts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'programs' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('programs')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'programs' && styles.filterButtonTextActive]}>
                Programs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'nutrition' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('nutrition')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'nutrition' && styles.filterButtonTextActive]}>
                Nutrition
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getFilteredContent().map((item) => renderContent(item))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <WorkoutCategoryCard
                key={index}
                title={category.title}
                count={category.count}
                onPress={() => {
                  // Handle category selection
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Trainers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTrainers.map((trainer) => (
              <TrainerCard key={`trainer-${trainer.id}`} {...trainer} />
            ))}
          </ScrollView>
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
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    padding: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
    marginLeft: 4,
  },
  trendingCard: {
    width: width * 0.7,
    marginRight: 8,
    marginBottom: 4,
  },
  contentWrapper: {
    width: width * 0.7,
    marginRight: 8,
    marginBottom: 4,
  },
  trainerWrapper: {
    width: width * 0.7,
    marginRight: 8,
    marginBottom: 4,
  },
  gradientBorder: {
    flex: 1,
    padding: 2,
    borderRadius: 14,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  durationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  durationText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  contentInfo: {
    padding: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 12,
    color: COLORS.text.secondary,
    flex: 1,
  },
  levelIndicator: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.lightGrey,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  categoryWrapper: {
    width: (width - 40) / 2,
    aspectRatio: 1.2,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  trainerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  trainerSpecialty: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: COLORS.lightGrey,
    marginBottom: 8,
    marginTop: -40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  recommendedCard: {
    width: width * 0.7,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  recommendedMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metadataText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
  },
  filterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrey,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: '#60A5FA',
  },
  filterButtonText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: '500',
  },
  trainerTribeBanner: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 0,
    backgroundColor: '#fff',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    marginTop: -30,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: '50%',
    marginTop: '10%',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4169E1',
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    lineHeight: 32,
  },
  connectContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  arrowContainer: {
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  connectButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  gradientFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  trainerLikeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
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