import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Linking,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EditProfileModal from '../components/EditProfileModal';
import ChatbotModal from '../components/ChatbotModal';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { COLORS } from '../constants/colors';
import { useAuth } from '../AuthContext';
import supabase from '../utils/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DefaultProfilePicture = () => (
  <View style={styles.defaultProfileImage}>
    <Text style={styles.sadFace}>:(</Text>
  </View>
);

const StatisticCard = ({ title, value, change, isPositive }) => (
  <View style={styles.statisticCard}>
    <Text style={styles.statisticTitle}>{title}</Text>
    <Text style={styles.statisticValue}>{value}</Text>
    {change && (
      <View style={[styles.changeIndicator, isPositive ? styles.positiveChange : styles.negativeChange]}>
        <Ionicons 
          name={isPositive ? "arrow-up" : "arrow-down"} 
          size={12} 
          color={isPositive ? "#4CAF50" : "#F44336"} 
        />
        <Text style={[styles.changeText, isPositive ? styles.positiveText : styles.negativeText]}>
          {change}%
        </Text>
      </View>
    )}
  </View>
);

// AchievementBadge now expects translation KEYS, not translated strings
const AchievementBadge = ({ icon, titleKey, descriptionKey }) => {
  const { t } = useLanguage();
  return (
    <View style={styles.achievementBadge}>
      <View style={styles.badgeIcon}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.badgeTitle}>{t(titleKey)}</Text>
      <Text style={styles.badgeDescription}>{t(descriptionKey)}</Text>
    </View>
  );
};

const SocialLink = ({ platform, username, url, icon }) => (
  <TouchableOpacity 
    style={styles.socialLink}
    onPress={() => Linking.openURL(url)}
  >
    <Ionicons name={icon} size={20} color={COLORS.text.secondary} />
    <Text style={styles.socialUsername}>{username}</Text>
  </TouchableOpacity>
);

const RobotIcon = () => (
  <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
    {/* Main head circle */}
    <View style={{
      width: 24,
      height: 24,
      backgroundColor: COLORS.white,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Antenna dot */}
      <View style={{
        width: 6,
        height: 6,
        backgroundColor: COLORS.white,
        borderRadius: 3,
        position: 'absolute',
        top: -8,
      }} />
      
      {/* Eyes container */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 14,
        position: 'absolute',
        top: 6
      }}>
        {/* Left eye */}
        <View style={{
          width: 5,
          height: 5,
          backgroundColor: COLORS.primary,
          borderRadius: 2.5,
        }} />
        {/* Right eye */}
        <View style={{
          width: 5,
          height: 5,
          backgroundColor: COLORS.primary,
          borderRadius: 2.5,
        }} />
      </View>
      
      {/* Smile */}
      <View style={{
        width: 12,
        height: 6,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderTopWidth: 0,
        position: 'absolute',
        bottom: 6,
      }} />
    </View>
  </View>
);

const ContentTab = ({ posts }) => (
  <View style={styles.contentGrid}>
    {posts.map((post) => (
      <TouchableOpacity key={post.id} style={styles.contentItem}>
        <Image source={post.image} style={styles.contentImage} />
        <View style={styles.contentOverlay}>
          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color="#fff" />
              <Text style={styles.statText}>{post.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={16} color="#fff" />
              <Text style={styles.statText}>{post.comments}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const STATISTICS = [
  { titleKey: 'profileViews', value: "2.3K", change: 12, isPositive: true },
  { titleKey: 'engagementRate', value: "5.8%", change: 2.5, isPositive: true },
  { titleKey: 'subscriberGrowth', value: "+283", change: 15, isPositive: true },
];

const ACHIEVEMENTS = [
  { icon: "trophy", titleKey: "topCreator", descriptionKey: "topCreatorDesc" },
  { icon: "trending-up", titleKey: "risingStar", descriptionKey: "risingStarDesc" },
  { icon: "people", titleKey: "community", descriptionKey: "communityDesc" },
];

const LIFESTYLE_POSTS = [
  {
    id: '1',
    image: require('../assets/featured_workout.jpg'),
    likes: '1.2K',
    comments: '89',
    isPremium: false,
  },
  // Add more lifestyle posts here
];

const TRAINER_POSTS = [
  {
    id: '2',
    image: require('../assets/trainer1.jpg'),
    likes: '956',
    comments: '67',
    isPremium: true,
  },
  // Add more trainer posts here
];

const SAVED_POSTS = [
  // Populate this with saved post objects, e.g. from user data
];

export default function ProfileScreen() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, language, setLanguage, key: languageKey } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('lifestyle');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: t('defaultName'),
    handle: t('defaultHandle'),
    bio: t('defaultBio'),
    followers: '',
    following: '',
    posts: '',
    image: null,
    isVerified: false,
    isPremiumCreator: false,
    email: '',
    tokens: 0,
    achievementsPublic: true,
    followingPublic: true,
    socialLinks: [],
  });

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Always start loading
      setError(null);
      console.log("fetchProfile called. user:", user);
      let didTimeout = false;
      // Timeout fallback in case network hangs
      const timeout = setTimeout(() => {
        didTimeout = true;
        setLoading(false);
        setError('Profile request timed out.');
      }, 10000); // 10 seconds

      try {
        if (!user) {
          setLoading(false);
          clearTimeout(timeout);
          return;
        }
        setLoading(true);
        setError(null);
        // Adjust table and column names as per your Supabase schema
        console.log("About to fetch profile from Supabase for user id:", user?.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error("Supabase profile fetch error:", error, "for user id:", user?.id);
          throw error;
        }
        if (data) {
          console.log("Fetched profile data from Supabase:", data);
          setProfileData(prev => ({
            ...prev,
            name: data.full_name || prev.name,
            handle: data.handle || prev.handle,
            bio: data.bio || prev.bio,
            followers: data.followers ?? prev.followers,
            following: data.following ?? prev.following,
            posts: data.posts ?? prev.posts,
            image: data.avatar_url || prev.image,
            isVerified: data.is_verified ?? prev.isVerified,
            isPremiumCreator: data.is_premium_creator ?? prev.isPremiumCreator,
            email: data.email || user.email || prev.email,
            tokens: data.tokens ?? prev.tokens,
            achievementsPublic: data.achievements_public ?? prev.achievementsPublic,
            followingPublic: data.following_public ?? prev.followingPublic,
            socialLinks: data.social_links || prev.socialLinks,
          }));
        }
      } catch (err) {
        setError('Failed to load profile.');
        setLoading(false);
        console.error('Profile fetch failed:', err);
      } finally {
        clearTimeout(timeout);
      }
    }
    // Only run on mount or user change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Ensure profileData updates when language changes
  // Only update default fields if they are still at the default value
  React.useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      name: prev.name === t('defaultName') ? t('defaultName') : prev.name,
      handle: prev.handle === t('defaultHandle') ? t('defaultHandle') : prev.handle,
      bio: prev.bio === t('defaultBio') ? t('defaultBio') : prev.bio,
    }));
  }, [t, language, languageKey]);

  const handleEditProfile = async (updatedData) => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      // Prepare update payload (adjust keys if your schema differs)
      const payload = {
        full_name: updatedData.name,
        handle: updatedData.handle,
        bio: updatedData.bio,
        email: updatedData.email,
        avatar_url: updatedData.image,
        achievements_public: updatedData.achievementsPublic,
        social_links: updatedData.socialLinks,
      };
      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);
      if (updateError) throw updateError;
      // Immediately re-fetch the profile from Supabase to get the latest data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (fetchError) throw fetchError;
      if (data) {
        setProfileData(prev => ({
          ...prev,
          name: data.full_name || prev.name,
          handle: data.handle || prev.handle,
          bio: data.bio || prev.bio,
          followers: data.followers ?? prev.followers,
          following: data.following ?? prev.following,
          posts: data.posts ?? prev.posts,
          image: data.avatar_url || prev.image,
          isVerified: data.is_verified ?? prev.isVerified,
          isPremiumCreator: data.is_premium_creator ?? prev.isPremiumCreator,
          email: data.email || user.email || prev.email,
          tokens: data.tokens ?? prev.tokens,
          achievementsPublic: data.achievements_public ?? prev.achievementsPublic,
          followingPublic: data.following_public ?? prev.followingPublic,
          socialLinks: data.social_links || prev.socialLinks,
        }));
      }
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: t('shareProfileMessage', {name: profileData.name, bio: profileData.bio, handle: profileData.handle}),
        title: t('shareProfileTitle', {name: profileData.name}),
      });
    } catch (error) {
      alert(t('errorSharingProfile')); // Translate error message
    }
  };

  // Move statistics array inside component body for reactivity
  // All titles must use translation keys
  const statistics = React.useMemo(() => ([
    { title: t('profileViews'), value: "2.3K", change: 12, isPositive: true },
    { title: t('engagementRate'), value: "5.8%", change: 2.5, isPositive: true },
    { title: t('subscriberGrowth'), value: "+283", change: 15, isPositive: true },
  ]), [t, language, languageKey]);

  // All achievement titles and descriptions must use translation keys
  // Pass translation KEYS, not translated strings
  const achievements = [
    { icon: "trophy", titleKey: "topCreator", descriptionKey: "topCreatorDesc" },
    { icon: "trending-up", titleKey: "risingStar", descriptionKey: "risingStarDesc" },
    { icon: "people", titleKey: "community", descriptionKey: "communityDesc" },
  ];

  const [lifestylePosts] = useState([
    {
      id: '1',
      image: require('../assets/featured_workout.jpg'),
      likes: '1.2K',
      comments: '89',
      isPremium: false,
    },
    // Add more lifestyle posts here
  ]);

  const [trainerPosts] = useState([
    {
      id: '2',
      image: require('../assets/trainer1.jpg'),
      likes: '956',
      comments: '67',
      isPremium: true,
    },
    // Add more trainer posts here
  ]);

  const [savedPosts] = useState([
    // Populate this with saved post objects, e.g. from user data
  ]);

  const navigation = useNavigation();

  // MOCK: Replace with actual logic to determine if the current user is the profile owner
  const isOwnProfile = true; // Set to true for now; replace with real auth/user check

  // Handler for toggling achievement visibility
  const handleToggleAchievementsVisibility = () => {
    setProfileData((prev) => ({
      ...prev,
      achievementsPublic: !prev.achievementsPublic,
    }));
  };

  // Handler for toggling following visibility
  const handleToggleFollowingVisibility = () => {
    setProfileData((prev) => ({
      ...prev,
      followingPublic: !prev.followingPublic,
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ color: theme.text, fontSize: 18 }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> key={languageKey}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: COLORS.white }]}
        bounces={true}
        overScrollMode="always"
      >

        <View style={[styles.header, { borderBottomColor: theme.border }]} > 
          <TouchableOpacity onPress={() => navigation.navigate('Store')}>
            <Ionicons name="cart-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsAbsolute} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.profileSection, { backgroundColor: theme.card }]} > 
          <View style={styles.profileHeader}>
            {profileData.image ? (
              <Image source={profileData.image} style={[styles.profileImage, { backgroundColor: theme.card, borderColor: theme.primary }]} />
            ) : (
              <View style={[styles.defaultProfileImage, { backgroundColor: theme.card }]}>
                <Text style={[styles.sadFace, { color: theme.textSecondary }]}>:(</Text>
              </View>
            )}
            <View style={styles.profileStats}>
              <View style={styles.statColumn}>
                <Text style={[styles.statValue, { color: theme.text }]}>{profileData.tokens !== undefined ? profileData.tokens : 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('posts')}</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={[styles.statValue, { color: theme.text }]}>{profileData.followers}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('followers')}</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={[styles.statValue, { color: theme.text }]}>{profileData.following}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('following')}</Text>
              </View>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: theme.text }]}>{profileData.name}</Text>
              {profileData.isVerified && (
                <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
              )}
              {profileData.isPremiumCreator && (
                <View style={[styles.premiumCreatorBadge, { backgroundColor: theme.primaryLight }]} > 
                  <Ionicons name="star" size={12} color="#FFD700" />
                </View>
              )}
            </View>
            <Text style={[styles.handle, { color: theme.textSecondary }]}>{profileData.handle}</Text>
            <Text style={[styles.bio, { color: theme.text }]}>{profileData.bio}</Text>
            {profileData.socialLinks && profileData.socialLinks.length > 0 && (
              <View style={styles.socialLinksContainer}>
                {profileData.socialLinks.map((link, index) => (
                  <TouchableOpacity key={link.platform} style={[styles.socialLink, { backgroundColor: theme.card }]} onPress={() => Linking.openURL(link.url)}>
                    <Ionicons name={link.icon} size={20} color={theme.textSecondary} />
                    <Text style={[styles.socialUsername, { color: theme.text }]}>{link.username}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={[styles.primaryButtonText, { color: theme.white }]}>{t('editProfile')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: theme.card }]}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={20} color={theme.text} style={styles.buttonIcon} />
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>{t('shareProfile')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Only show creator insights if this is the user's own profile */}
        {isOwnProfile && (
          <View style={[styles.creatorInsights, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('creatorInsights')}</Text>
              <TouchableOpacity>
                <Text style={[styles.seeMoreText, { color: theme.primary }]}>{t('seeDetails')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {statistics.map((stat, idx) => (
                <StatisticCard
                  key={idx}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  isPositive={stat.isPositive}
                />
              ))}
            </ScrollView>
          </View>
        )}


        {/* Only show achievements if public or if this is the user's own profile */}
        {(profileData.achievementsPublic || isOwnProfile) && (
          <View style={[styles.achievementsSection, { backgroundColor: theme.card }]}> 
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('achievements')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {achievements.map((achievement, index) => (
                <AchievementBadge key={index} {...achievement} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.contentSection, { backgroundColor: theme.background }]}>
          <View style={styles.contentTabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'lifestyle' && styles.activeTab]}
              onPress={() => setActiveTab('lifestyle')}
            >
              <Ionicons 
                name="grid-outline" 
                size={24} 
                color={activeTab === 'lifestyle' ? theme.primary : theme.textSecondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'trainer' && styles.activeTab]}
              onPress={() => setActiveTab('trainer')}
            >
              <Ionicons 
                name="fitness-outline" 
                size={24} 
                color={activeTab === 'trainer' ? theme.primary : theme.textSecondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
              onPress={() => setActiveTab('saved')}
            >
              <Ionicons 
                name="bookmark-outline" 
                size={24} 
                color={activeTab === 'saved' ? theme.primary : theme.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {activeTab === 'lifestyle' && <ContentTab posts={lifestylePosts} />}
          {activeTab === 'trainer' && <ContentTab posts={trainerPosts} />}
          {activeTab === 'saved' && <ContentTab posts={savedPosts} />}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fabButton}
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
          style={styles.fabGradient}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={theme.white} />
        </LinearGradient>
      </TouchableOpacity>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleEditProfile}
        initialData={profileData}
      />

      <ChatbotModal
        visible={isChatbotVisible}
        onClose={() => setIsChatbotVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingsAbsolute: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 5,
  },
  profileHeaderTitleWrapper: {
    alignItems: 'center',
    marginTop: 36, // legacy, not used for lower title
    marginBottom: 8,
  },
  profileHeaderTitleWrapperLower: {
    alignItems: 'center',
    marginTop: 56, // move title further down from the top
    marginBottom: 16,
  },
  profileHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    marginTop: 8,
  },
  statColumn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  profileInfo: {
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 8,
  },
  handle: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  creatorInsights: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  seeMoreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  statisticCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 8,
    width: width * 0.4,
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statisticTitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  statisticValue: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveChange: {
    backgroundColor: '#4CAF5015',
  },
  negativeChange: {
    backgroundColor: '#F4433615',
  },
  changeText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  positiveText: {
    color: '#4CAF50',
  },
  negativeText: {
    color: '#F44336',
  },
  achievementsSection: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 16,
  },
  achievementBadge: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 8,
    width: width * 0.4,
    alignItems: 'center',
    shadowColor: COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  contentTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0.5,
    backgroundColor: COLORS.white,
  },
  contentItem: {
    width: width / 3,
    height: width / 3,
    padding: 0.5,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  contentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumCreatorBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 16,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  socialUsername: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 6,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  sadFace: {
    fontSize: 40,
    color: '#666',
    transform: [{ rotate: '90deg' }],
    textAlign: 'center',
    includeFontPadding: false,
    padding: 0,
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
