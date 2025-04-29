import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useLanguage } from '../LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import SocialLeaderboard from '../components/SocialLeaderboard';
import HealthTracker from '../components/HealthTracker';
import WeeklyStepsChart from '../components/WeeklyStepsChart';
import StretchLibrary from '../components/StretchLibrary';
import WorkoutCategoryCard from '../components/WorkoutCategoryCard';
import { LinearGradient } from 'expo-linear-gradient';
import ChatbotModal from '../components/ChatbotModal';

// Raw data arrays moved outside component
const WORKOUTS = [
  {
    id: 'workout-1',
    typeKey: 'workout',
    titleKey: 'fullBodyHIITWorkout',
    duration: '45 min',
    calories: '400',
    levelKey: 'intermediate',
    image: require('../assets/trainer1.jpg'),
    creator: {
      nameKey: 'theSculptedVegan',
      image: require('../assets/trainer1.jpg'),
    },
  },
  {
    id: 'workout-2',
    typeKey: 'workout',
    titleKey: 'coreStrengthBasics',
    duration: '30 min',
    calories: '250',
    levelKey: 'beginner',
    image: require('../assets/trainer2.jpg'),
    creator: {
      nameKey: 'laurasFitness',
      image: require('../assets/trainer2.jpg'),
    },
  },
];

const PROGRAMS = [
  {
    id: 'program-1',
    typeKey: 'program',
    titleKey: 'thirtyDayYogaChallenge',
    duration: '30 days',
    levelKey: 'allLevels',
    image: require('../assets/trainer2.jpg'),
    creator: {
      nameKey: 'laurasFitness',
      image: require('../assets/trainer2.jpg'),
    },
  },
  {
    id: 'program-2',
    typeKey: 'program',
    titleKey: 'eightWeekBodyTransform',
    duration: '8 weeks',
    levelKey: 'advanced',
    image: require('../assets/trainer1.jpg'),
    creator: {
      nameKey: 'theSculptedVegan',
      image: require('../assets/trainer1.jpg'),
    },
  },
];

const NUTRITION_CONTENT = [
  {
    id: 'nutrition-1',
    typeKey: 'nutrition',
    titleKey: 'mealPrepBasics',
    duration: '7 days',
    calories: '2000/day',
    levelKey: 'beginner',
    image: require('../assets/trainer1.jpg'),
    creator: {
      nameKey: 'nutritionPro',
      image: require('../assets/trainer1.jpg'),
    },
  },
  {
    id: 'nutrition-2',
    typeKey: 'nutrition',
    titleKey: 'plantBasedMealPlan',
    duration: '14 days',
    calories: '1800/day',
    levelKey: 'intermediate',
    image: require('../assets/trainer2.jpg'),
    creator: {
      nameKey: 'veganKitchen',
      image: require('../assets/trainer2.jpg'),
    },
  },
];

const CATEGORIES = [
  { titleKey: 'strength', categoryKey: 'strength', count: 128 },
  { titleKey: 'cardio', categoryKey: 'cardio', count: 95 },
  { titleKey: 'yoga', categoryKey: 'yoga', count: 89 },
  { titleKey: 'hiit', categoryKey: 'hiit', count: 76 },
];

const FEATURED_TRAINERS = [
  {
    id: 'trainer-1',
    nameKey: 'sarahJohnson',
    specialtyKey: 'hiitAndStrength',
    rating: '4.9',
    image: require('../assets/trainer1.jpg'),
  },
  {
    id: 'trainer-2',
    nameKey: 'mikeChen',
    specialtyKey: 'yogaAndMindfulness',
    rating: '4.8',
    image: require('../assets/trainer2.jpg'),
  },
];

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
  };

  return (
    <TouchableOpacity 
      style={styles.likeButton}
      onPress={animateLike}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {isLiked ? (
          <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
            <LinearGradient
              colors={['#4169E1', '#60A5FA']}
              style={{ position: 'absolute', width: 24, height: 24, borderRadius: 12 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Ionicons name="heart" size={20} color="#fff" style={{ position: 'absolute', top: 2, left: 2 }} />
            <Ionicons name="heart-outline" size={24} color="#4169E1" style={{ position: 'absolute', top: 0, left: 0 }} />
          </View>
        ) : (
          <Ionicons name="heart-outline" size={24} color="#4169E1" style={{ alignSelf: 'center' }} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const ContentCard = ({ image, titleKey, typeKey, creator, duration, levelKey }) => {
  const { t } = useLanguage();
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
        colors={["#4169E1", "#60A5FA", "#4169E1"]}
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
            <Text style={styles.badgeText}>{t(typeKey).toUpperCase()}</Text>
          </View>
          {duration && (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          )}
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle} numberOfLines={2}>{t(titleKey)}</Text>
            <View style={styles.creatorInfo}>
              <Image source={creator.image} style={styles.creatorAvatar} />
              <Text style={styles.creatorName} numberOfLines={1}>{creator.name}</Text>
            </View>
            {levelKey && (
              <View style={styles.levelIndicator}>
                <Text style={styles.levelText}>{t(levelKey)}</Text>
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
  const { t } = useLanguage();
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
        colors={["#4169E1", "#60A5FA", "#4169E1"]}
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
            <Ionicons name={icon} size={24} color="#fff" />
          </View>
          <Text style={styles.categoryTitle}>{t(title)}</Text>
          <Text style={styles.categoryCount}>{count + ' ' + t('workouts')}</Text>
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

const TrainerCard = ({ image, nameKey, specialtyKey, rating }) => {
  const { t } = useLanguage();
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
        colors={["#4169E1", "#60A5FA", "#4169E1"]}
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
            <Text style={styles.trainerName}>{t(nameKey)}</Text>
            <Text style={styles.trainerSpecialty}>{t(specialtyKey)}</Text>
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
  const navigation = useNavigation();
  const { t, language, key: languageKey } = useLanguage();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const workouts = useMemo(() => WORKOUTS.map((workout) => ({ ...workout, title: t(workout.titleKey), creator: { ...workout.creator, name: t(workout.creator.nameKey) } })), [languageKey]);
  const programs = useMemo(() => PROGRAMS.map((program) => ({ ...program, title: t(program.titleKey), creator: { ...program.creator, name: t(program.creator.nameKey) } })), [languageKey]);
  const nutritionContent = useMemo(() => NUTRITION_CONTENT.map((nutrition) => ({ ...nutrition, title: t(nutrition.titleKey), creator: { ...nutrition.creator, name: t(nutrition.creator.nameKey) } })), [languageKey]);
  const categories = useMemo(() => CATEGORIES.map((category) => ({ ...category, title: t(category.titleKey) })), [languageKey]);
  const featuredTrainers = useMemo(() => FEATURED_TRAINERS.map((trainer) => ({ ...trainer, name: t(trainer.nameKey), specialty: t(trainer.specialtyKey) })), [languageKey]);

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
    const { t } = useLanguage();
    return (
      <View style={styles.trendingCard} key={`card-${item.id}`}>
        <ContentCard
          key={`content-${item.id}`}
          image={item.image}
          titleKey={item.titleKey}
          typeKey={item.typeKey}
          creator={item.creator}
          duration={item.duration}
          levelKey={item.levelKey}
        />
      </View>
    );
  };

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.mode === 'dark' ? '#fff' : '#222',
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

  return (
    <SafeAreaView style={themedStyles.container} key={languageKey}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themedStyles.scrollContent}
      >
        <TouchableOpacity style={styles.trainerTribeBanner}>
          <Image 
            source={require('../assets/trainer-tribe-banner.jpg')} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{t('exploreHeroTitle')}</Text>
              <Text style={styles.heroDescription}>{t('exploreHeroDescription')}</Text>
            </View>
            <View style={styles.connectContainer}>
              <AnimatedArrow />
              <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate('TrainerDirectory')}>
                <Text style={styles.connectButtonText}>{t('connectButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <SocialLeaderboard />


        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'all' && styles.filterButtonTextActive]}>{t('allContent')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'workouts' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('workouts')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'workouts' && styles.filterButtonTextActive]}>{t('workouts')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'programs' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('programs')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'programs' && styles.filterButtonTextActive]}>{t('programs')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'nutrition' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('nutrition')}
            >
              <Text style={[styles.filterButtonText, activeFilter === 'nutrition' && styles.filterButtonTextActive]}>{t('nutrition')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={themedStyles.sectionTitle}>{t('forYou')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getFilteredContent().map((item) => renderContent(item))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={themedStyles.sectionTitle}>{t('popularCategories')}</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <WorkoutCategoryCard
                key={index}
                title={category.title}
                categoryKey={category.categoryKey}
                count={category.count}
                onPress={() => {
                  // Handle category selection
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={themedStyles.sectionTitle}>{t('featuredTrainers')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTrainers.map((trainer) => (
              <TrainerCard 
                key={`trainer-${trainer.id}`}
                image={trainer.image}
                nameKey={trainer.nameKey}
                specialtyKey={trainer.specialtyKey}
                rating={trainer.rating}
              />
            ))}
          </ScrollView>
        </View>

        {/* Health Tracker Section */}
        <HealthTracker />
      <WeeklyStepsChart />

        <TouchableOpacity
          style={{
            marginHorizontal: 16,
            marginTop: 18,
            marginBottom: 8,
            borderRadius: 16,
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            paddingHorizontal: 20,
          }}
          onPress={() => navigation.navigate('StretchLibraryScreen')}
        >
          {/* Stick figure stretching icon using SVG */}
          <Svg width={48} height={48} viewBox="0 0 32 32" style={{ marginRight: 20 }}>
            {/* Head */}
            <Circle cx="16" cy="7" r="3" fill={theme.white} />
            {/* Body */}
            <Rect x="15" y="10" width="2" height="8" fill={theme.white} rx="1" />
            {/* Left arm stretched upward */}
            <Path d="M16 12 L10 5" stroke={theme.white} strokeWidth="2" strokeLinecap="round" />
            {/* Right arm down */}
            <Path d="M16 12 L22 16" stroke={theme.white} strokeWidth="2" strokeLinecap="round" />
            {/* Left leg */}
            <Path d="M16 18 L12 28" stroke={theme.white} strokeWidth="2" strokeLinecap="round" />
            {/* Right leg */}
            <Path d="M16 18 L20 28" stroke={theme.white} strokeWidth="2" strokeLinecap="round" />
          </Svg>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.white, fontSize: 18, fontWeight: '700', marginBottom: 2 }}>
              Stretch Library
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '400' }}>
              Improve flexibility, mobility, and recovery with guided stretches.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.white} />
        </TouchableOpacity>

      </ScrollView>

      <TouchableOpacity 
        style={themedStyles.fabButton}
        onPress={async () => {
          const { playChatbotSound } = await import('../utils/sound');
          playChatbotSound();
          setIsChatbotVisible(true);
        }}
      >
        <LinearGradient
          colors={[theme.primary, '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={themedStyles.fabGradient}
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
    backgroundColor: '#fff',
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
    color: '#333',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ccc',
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
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  contentInfo: {
    padding: 12,
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
    color: '#666',
    flex: 1,
  },
  levelIndicator: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f7f7f7',
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: '#f7f7f7',
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
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  trainerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
    shadowColor: '#ccc',
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
  trainerSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  welcomeSection: {
    padding: 16,
    backgroundColor: '#f7f7f7',
    marginBottom: 8,
    marginTop: -40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  recommendedCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#ccc',
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
    color: '#333',
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
    color: '#666',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#4169E1',
    borderRadius: 4,
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#4169E1',
    borderColor: '#60A5FA',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  heroDescription: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 0,
    lineHeight: 30,
    letterSpacing: 0.1,
    textAlign: 'left',
    maxWidth: 260,
  },
  trainerTribeBanner: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 16,
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
    color: '#fff',
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