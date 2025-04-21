import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useLanguage } from '../LanguageContext';

const PostTypeSelector = ({ selectedType, onSelect }) => {
  const { t } = useLanguage();
  return (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          selectedType === 'trainer' && styles.selectorButtonActive,
        ]}
        onPress={() => onSelect('trainer')}
      >
        <LinearGradient
          colors={selectedType === 'trainer' ? ['#4169E1', '#60A5FA'] : ['transparent', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Ionicons
          name="barbell-outline"
          size={24}
          color={selectedType === 'trainer' ? '#fff' : '#666'}
        />
        <Text style={[
          styles.selectorText,
          selectedType === 'trainer' && styles.selectorTextActive
        ]}>
          {t('postAsTrainer')}
        </Text>
        <Text style={[
          styles.selectorSubtext,
          selectedType === 'trainer' && styles.selectorSubtextActive
        ]}>
          {t('createPremiumFitnessContent')}
        </Text>
        <View style={[
          styles.destinationTag,
          selectedType === 'trainer' && styles.destinationTagActive
        ]}>
          <Ionicons
            name="compass-outline"
            size={14}
            color={selectedType === 'trainer' ? COLORS.primary : COLORS.primary}
          />
          <Text style={[
            styles.destinationText,
            selectedType === 'trainer' && styles.destinationTextActive
          ]}>{t('postsToFitnessFeed')}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.selectorButton,
          selectedType === 'lifestyle' && styles.selectorButtonActive,
        ]}
        onPress={() => onSelect('lifestyle')}
      >
        <LinearGradient
          colors={selectedType === 'lifestyle' ? ['#4169E1', '#60A5FA'] : ['transparent', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Ionicons
          name="heart-outline"
          size={24}
          color={selectedType === 'lifestyle' ? '#fff' : '#666'}
        />
        <Text style={[
          styles.selectorText,
          selectedType === 'lifestyle' && styles.selectorTextActive
        ]}>
          {t('postAsLifestyle')}
        </Text>
        <Text style={[
          styles.selectorSubtext,
          selectedType === 'lifestyle' && styles.selectorSubtextActive
        ]}>
          {t('shareYourFitnessJourney')}
        </Text>
        <View style={[
          styles.destinationTag,
          selectedType === 'lifestyle' && styles.destinationTagActive
        ]}>
          <Ionicons
            name="home-outline"
            size={14}
            color={COLORS.primary}
          />
          <Text style={[
            styles.destinationText,
            selectedType === 'lifestyle' && styles.destinationTextActive
          ]}>{t('postsToHomeFeed')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const TrainerPostForm = () => {
  const { t } = useLanguage();
  return (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>{t('createPremiumContent')}</Text>
      
      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
        <Text style={styles.uploadText}>Upload Video or Photos</Text>
        <Text style={styles.uploadSubtext}>Add exercise demonstrations</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.titleInput}
        placeholder="Workout Title"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.descriptionInput}
        placeholder="Describe your workout program..."
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
      />

      <View style={styles.metadataContainer}>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Duration</Text>
          <TextInput
            style={styles.metadataInput}
            placeholder="45 mins"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Difficulty</Text>
          <TextInput
            style={styles.metadataInput}
            placeholder="Intermediate"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.pricingContainer}>
        <Text style={styles.pricingLabel}>Set Price</Text>
        <TextInput
          style={styles.pricingInput}
          placeholder="$0.00"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  );
};

const LifestylePostForm = () => {
  const { t } = useLanguage();
  return (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>{t('shareYourFitnessJourney')}</Text>

      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="images-outline" size={32} color={COLORS.primary} />
        <Text style={styles.uploadText}>{t('addPhotos')}</Text>
        <Text style={styles.uploadSubtext}>{t('shareYourProgress')}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.captionInput}
        placeholder={t('whatsOnYourMind')}
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
      />

      <View style={styles.tagsContainer}>
        <Text style={styles.tagsLabel}>{t('addTags')}</Text>
        <View style={styles.tagsList}>
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>#transformation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>#motivation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>#fitness</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const CreatePostScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const [postType, setPostType] = useState('lifestyle');
  const [isPosting, setIsPosting] = useState(false);

  // Make sure POST_TYPES is defined
  // Example placeholder if not imported from elsewhere
  const POST_TYPES = [
    { label: 'trainer', subtext: 'createPremiumFitnessContent', destination: 'postsToFitnessFeed' },
    { label: 'lifestyle', subtext: 'shareYourFitnessJourney', destination: 'postsToHomeFeed' },
  ];
  const postTypeOptions = useMemo(() => POST_TYPES.map((postType) => ({
    ...postType,
    label: t(postType.label),
    subtext: t(postType.subtext),
    destination: t(postType.destination),
  })), [t]);

  const handlePost = async () => {
    setIsPosting(true);
    try {
      // Here you would handle the actual post creation
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the appropriate screen based on post type
      if (postType === 'trainer') {
        navigation.navigate('Explore');
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close-outline" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('createPost')}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.headerButton, styles.postButton, isPosting && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={isPosting}
        >
          {isPosting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.white} />
            </View>
          ) : (
            <View style={styles.postButtonTextContainer}>
              <Text style={styles.postButtonText}>{t('post')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <PostTypeSelector
          selectedType={postType}
          onSelect={setPostType}
        />
        {postType === 'trainer' ? <TrainerPostForm /> : <LifestylePostForm />}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  headerButton: {
    minWidth: 70, // Ensure both side buttons take up equal space
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonTextContainer: {
    minWidth: 40,
    alignItems: 'center',
  },
  postButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  selectorContainer: {
    padding: 16,
    gap: 12,
  },
  selectorButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
    overflow: 'hidden',
  },
  selectorButtonActive: {
    backgroundColor: COLORS.primary,
  },
  selectorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  selectorTextActive: {
    color: COLORS.white,
  },
  selectorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectorSubtextActive: {
    color: COLORS.white,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  titleInput: {
    fontSize: 18,
    padding: 12,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    marginBottom: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  captionInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    marginBottom: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  metadataContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metadataItem: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  metadataInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
  },
  pricingContainer: {
    marginBottom: 16,
  },
  pricingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  pricingInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  destinationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  destinationTagActive: {
    backgroundColor: COLORS.white,
  },
  destinationText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  destinationTextActive: {
    color: COLORS.primary,
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    minWidth: 40,
    alignItems: 'center',
  },
});

export default CreatePostScreen;