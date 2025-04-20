import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EditProfileModal from '../components/EditProfileModal';
import ChatbotModal from '../components/ChatbotModal';
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

const AchievementBadge = ({ icon, title, description }) => (
  <View style={styles.achievementBadge}>
    <View style={styles.badgeIcon}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.badgeTitle}>{title}</Text>
    <Text style={styles.badgeDescription}>{description}</Text>
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
        {post.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
          </View>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

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

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('content');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    handle: "@sarahfitness",
    bio: "Certified Personal Trainer 💪\nEmpowering women through fitness 🌟\nFounder of FitWithSarah Program",
    followers: "15.2K",
    following: "892",
    posts: "234",
    image: null,
    isVerified: true,
    isPremiumCreator: true,
    email: "sarah@example.com",
    socialLinks: [
      {
        platform: 'Instagram',
        username: '@sarahfit',
        url: 'https://instagram.com/sarahfit',
        icon: 'logo-instagram'
      },
      {
        platform: 'YouTube',
        username: 'SarahFitness',
        url: 'https://youtube.com/sarahfitness',
        icon: 'logo-youtube'
      },
      {
        platform: 'TikTok',
        username: '@sarahfit',
        url: 'https://tiktok.com/@sarahfit',
        icon: 'logo-tiktok'
      }
    ]
  });

  const handleEditProfile = (updatedData) => {
    setProfileData({
      ...profileData,
      ...updatedData,
    });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${profileData.name}'s fitness profile!\n${profileData.bio}\n\nFollow ${profileData.handle} on OnlyFitness`,
        title: `${profileData.name}'s Fitness Profile`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const statistics = [
    { title: "Profile Views", value: "2.3K", change: 12, isPositive: true },
    { title: "Engagement Rate", value: "5.8%", change: 2.5, isPositive: true },
    { title: "Subscriber Growth", value: "+283", change: 15, isPositive: true },
  ];

  const achievements = [
    { icon: "trophy", title: "Top Creator", description: "Top 1% in Fitness" },
    { icon: "trending-up", title: "Rising Star", description: "Growing rapidly" },
    { icon: "people", title: "Community", description: "Active community" },
  ];

  const posts = [
    {
      id: '1',
      image: require('../assets/trainer1.jpg'),
      likes: '1.2K',
      comments: '89',
      isPremium: true,
    },
    {
      id: '2',
      image: require('../assets/trainer2.jpg'),
      likes: '956',
      comments: '67',
      isPremium: false,
    },
  ];

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 100 }]}
        bounces={true}
        overScrollMode="always"
      >
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {profileData.image ? (
              <Image source={profileData.image} style={styles.profileImage} />
            ) : (
              <DefaultProfilePicture />
            )}
            <View style={styles.profileStats}>
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>{profileData.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>{profileData.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>{profileData.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{profileData.name}</Text>
              {profileData.isVerified && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              )}
              {profileData.isPremiumCreator && (
                <View style={styles.premiumCreatorBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                </View>
              )}
            </View>
            <Text style={styles.handle}>{profileData.handle}</Text>
            <Text style={styles.bio}>{profileData.bio}</Text>
            
            {profileData.socialLinks && profileData.socialLinks.length > 0 && (
              <View style={styles.socialLinksContainer}>
                {profileData.socialLinks.map((link, index) => (
                  <SocialLink
                    key={`${link.platform}-${index}`}
                    {...link}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={20} color={COLORS.text.primary} style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.creatorInsights}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Creator Insights</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See Details</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {statistics.map((stat, index) => (
              <StatisticCard key={index} {...stat} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.contentTabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'content' && styles.activeTab]}
              onPress={() => setActiveTab('content')}
            >
              <Ionicons 
                name="grid-outline" 
                size={24} 
                color={activeTab === 'content' ? COLORS.primary : COLORS.text.secondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'programs' && styles.activeTab]}
              onPress={() => setActiveTab('programs')}
            >
              <Ionicons 
                name="fitness-outline" 
                size={24} 
                color={activeTab === 'programs' ? COLORS.primary : COLORS.text.secondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
              onPress={() => setActiveTab('saved')}
            >
              <Ionicons 
                name="bookmark-outline" 
                size={24} 
                color={activeTab === 'saved' ? COLORS.primary : COLORS.text.secondary} 
              />
            </TouchableOpacity>
          </View>
          <ContentTab posts={posts} />
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
