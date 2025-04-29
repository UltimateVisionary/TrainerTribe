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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EditProfileModal from '../components/EditProfileModal';
import ChatbotModal from '../components/ChatbotModal';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { getProfile, updateProfile } from '../utils/profileService';
import { getUserPosts } from '../utils/postsService';
import { COLORS } from '../constants/colors';
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

const ContentTab = ({ posts, theme, t, navigation }) => (
  <View style={styles.contentGrid}>
    {posts && posts.length > 0 ? (
      posts.map((post) => (
        <TouchableOpacity 
          key={post.id} 
          style={styles.contentItem}
          onPress={() => navigation.navigate('PostDetails', { postId: post.id })}
        >
          {post.media_urls && post.media_urls.length > 0 ? (
            <Image 
              source={{ uri: post.media_urls[0] }} 
              style={styles.contentImage} 
            />
          ) : (
            <View style={[styles.contentImagePlaceholder, { backgroundColor: theme.border }]}>
              <Ionicons name="image-outline" size={32} color={theme.grey} />
            </View>
          )}
          <View style={styles.contentOverlay}>
            <View style={styles.contentStats}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={16} color="#fff" />
                <Text style={styles.statText}>{post.likes_count || '0'}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={16} color="#fff" />
                <Text style={styles.statText}>{post.comments_count || '0'}</Text>
              </View>
            </View>
            {post.is_premium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))
    ) : (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="images-outline" size={48} color={theme.grey} />
        <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
          {t('noPostsYet')}
        </Text>
      </View>
    )}
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

export default function ProfileScreen({ route }) {
  const { t, language, key: languageKey } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  
  // Allow viewing other profiles via route params
  const userId = route?.params?.userId || user?.id;
  const isOwnProfile = userId === user?.id;
  
  const [activeTab, setActiveTab] = useState('lifestyle');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    handle: '',
    bio: '',
    followers: "0",
    following: "0",
    posts: "0",
    image: null,
    isVerified: false,
    isPremiumCreator: false,
    email: "",
    achievementsPublic: true,
    followingPublic: true,
    socialLinks: []
  });
  const [userPosts, setUserPosts] = useState({
    lifestyle: [],
    trainer: [],
    saved: []
  });

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Fetch profile from database
        const { data: profile } = await getProfile(userId);
        
        if (profile) {
          setProfileData({
            name: `${profile.firstname} ${profile.lastname}`,
            handle: profile.user_handle,
            bio: profile.bio || t('defaultBio'),
            followers: profile.followers_count?.toString() || "0",
            following: profile.following_count?.toString() || "0",
            posts: profile.posts_count?.toString() || "0",
            image: profile.avatar_url,
            isVerified: profile.is_verified || false,
            isPremiumCreator: profile.is_premium || false,
            email: profile.email || "",
            achievementsPublic: profile.achievements_public !== false,
            followingPublic: profile.following_public !== false,
            socialLinks: profile.social_links || []
          });
        }
        
        // Load user's posts
        const { data: posts } = await getUserPosts(userId);
        
        if (posts) {
          // Category-based filtering would happen here
          const lifestyle = posts.filter(post => post.category === 'lifestyle' || !post.category);
          const trainer = posts.filter(post => post.category === 'trainer');
          
          setUserPosts({
            lifestyle,
            trainer,
            saved: [] // Would be fetched from saved_items table
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [userId, t]);

  const handleEditProfile = async (updatedData) => {
    if (!isOwnProfile) return;
    
    // Convert name to firstname, lastname for backend
    let updates = {};
    
    if (updatedData.name) {
      const nameParts = updatedData.name.split(' ');
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(' ') || '';
      
      updates.firstname = firstname;
      updates.lastname = lastname;
    }
    
    // Map frontend fields to backend fields
    if (updatedData.handle) updates.user_handle = updatedData.handle;
    if (updatedData.bio) updates.bio = updatedData.bio;
    if (updatedData.image) updates.avatar_url = updatedData.image;
    if (updatedData.socialLinks) updates.social_links = updatedData.socialLinks;
    if (updatedData.achievementsPublic !== undefined) updates.achievements_public = updatedData.achievementsPublic;
    if (updatedData.followingPublic !== undefined) updates.following_public = updatedData.followingPublic;
    
    // Update local state for immediate UI feedback
    setProfileData({
      ...profileData,
      ...updatedData
    });
    
    try {
      // Save to database
      await updateProfile(user.id, updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // On error, refresh profile data
      const { data: profile } = await getProfile(userId);
      if (profile) {
        setProfileData({
          name: `${profile.firstname} ${profile.lastname}`,
          handle: profile.user_handle,
          bio: profile.bio || t('defaultBio'),
          followers: profile.followers_count?.toString() || "0",
          following: profile.following_count?.toString() || "0",
          posts: profile.posts_count?.toString() || "0",
          image: profile.avatar_url,
          isVerified: profile.is_verified || false,
          isPremiumCreator: profile.is_premium || false,
          email: profile.email || "",
          achievementsPublic: profile.achievements_public !== false,
          followingPublic: profile.following_public !== false,
          socialLinks: profile.social_links || []
        });
      }
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

  // Handler for toggling achievement visibility
  const handleToggleAchievementsVisibility = () => {
    handleEditProfile({
      achievementsPublic: !profileData.achievementsPublic
    });
  };

  // Handler for toggling following visibility
  const handleToggleFollowingVisibility = () => {
    handleEditProfile({
      followingPublic: !profileData.followingPublic
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.white }]} key={languageKey}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>{t('loadingProfile')}</Text>
        </View>
      ) : (
        <>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContainer, { backgroundColor: COLORS.white }]}
            bounces={true}
            overScrollMode="always"
          >
            <View style={[styles.header, { borderBottomColor: theme.border }]} > 
              <View style={{ width: 24 }} />
              <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => navigation.navigate('Settings')}>
                <Ionicons name="settings-outline" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.profileSection, { backgroundColor: theme.card }]} > 
              <View style={styles.profileHeader}>
                {profileData.image ? (
                  <Image 
                    source={
                      typeof profileData.image === 'string' 
                        ? { uri: profileData.image } 
                        : profileData.image
                    } 
                    style={[styles.profileImage, { backgroundColor: theme.card, borderColor: theme.primary }]} 
                  />
                ) : (
                  <View style={[styles.defaultProfileImage, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sadFace, { color: theme.textSecondary }]}>:(</Text>
                  </View>
                )}
                <View style={styles.profileStats}>
                  <View style={styles.statColumn}>
                    <Text style={[styles.statValue, { color: theme.text }]}>{profileData.posts}</Text>
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
                <Text style={[styles.handle, { color: theme.textSecondary }]}>@{profileData.handle}</Text>
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
              {activeTab === 'lifestyle' && <ContentTab posts={userPosts.lifestyle} theme={theme} t={t} navigation={navigation} />}
              {activeTab === 'trainer' && <ContentTab posts={userPosts.trainer} theme={theme} t={t} navigation={navigation} />}
              {activeTab === 'saved' && <ContentTab posts={userPosts.saved} theme={theme} t={t} navigation={navigation} />}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.fabButton}
            onPress={() => setIsChatbotVisible(true)}
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  contentImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
