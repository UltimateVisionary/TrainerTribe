import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', urlPrefix: 'https://instagram.com/' },
  { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', urlPrefix: 'https://youtube.com/' },
  { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok', urlPrefix: 'https://tiktok.com/@' },
  { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', urlPrefix: 'https://twitter.com/' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', urlPrefix: 'https://facebook.com/' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', urlPrefix: 'https://linkedin.com/in/' },
  { id: 'pinterest', name: 'Pinterest', icon: 'logo-pinterest', urlPrefix: 'https://pinterest.com/' },
  { id: 'website', name: 'Website', icon: 'globe-outline', urlPrefix: 'https://' },
];

export default function EditProfileModal({ visible, onClose, onSave, initialData }) {
  const { t, language, key: languageKey } = useLanguage();
  const [name, setName] = useState(initialData?.name || '');
  const [handle, setHandle] = useState(initialData?.handle || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [image, setImage] = useState(initialData?.image || null);
  const [socialLinks, setSocialLinks] = useState(initialData?.socialLinks || []);
  const [achievementsPublic, setAchievementsPublic] = useState(
    typeof initialData?.achievementsPublic === 'boolean' ? initialData.achievementsPublic : true
  );

  // Sync modal state with latest initialData (profileData) whenever it changes
  React.useEffect(() => {
    setName(initialData?.name || '');
    setHandle(initialData?.handle || '');
    setBio(initialData?.bio || '');
    setEmail(initialData?.email || '');
    setImage(initialData?.image || null);
    setSocialLinks(initialData?.socialLinks || []);
    setAchievementsPublic(
      typeof initialData?.achievementsPublic === 'boolean' ? initialData.achievementsPublic : true
    );
  }, [initialData]);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert(t('cameraPermissionError') || 'Sorry, we need camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, {
      platform: '',
      username: '',
      url: '',
      icon: ''
    }]);
  };

  const handleRemoveSocialLink = (index) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleUpdateSocialLink = (index, platform) => {
    const newLinks = [...socialLinks];
    const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.id === platform);
    
    if (selectedPlatform) {
      newLinks[index] = {
        platform: selectedPlatform.name,
        username: newLinks[index]?.username || '',
        url: selectedPlatform.urlPrefix + (newLinks[index]?.username?.replace('@', '') || ''),
        icon: selectedPlatform.icon
      };
      setSocialLinks(newLinks);
    }
  };

  const handleUpdateUsername = (index, username) => {
    const newLinks = [...socialLinks];
    const platform = SOCIAL_PLATFORMS.find(p => p.name === newLinks[index].platform);
    
    newLinks[index] = {
      ...newLinks[index],
      username: username,
      url: platform ? platform.urlPrefix + username.replace('@', '') : username
    };
    setSocialLinks(newLinks);
  };

  const handleSave = () => {
    // Validate required fields
    if (!name.trim() || !handle.trim()) {
      Alert.alert(t('error'), t('nameHandleRequired'));
      return;
    }

    // Validate social links
    const validLinks = socialLinks.filter(link => 
      link.platform && link.username && link.url
    );

    onSave({
      name,
      handle,
      bio,
      email,
      image,
      socialLinks: validLinks,
      achievementsPublic,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="person" size={40} color="#666" />
                </View>
              )}
              <View style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>{t('changePhoto')}</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>{t('name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('namePlaceholder')}
              placeholderTextColor={COLORS.text.secondary}
            />

            <Text style={styles.label}>{t('handle')}</Text>
            <TextInput
              style={styles.input}
              value={handle}
              onChangeText={setHandle}
              placeholder={t('handlePlaceholder')}
              placeholderTextColor={COLORS.text.secondary}
            />

            <Text style={styles.label}>{t('bio')}</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder={t('bioPlaceholder')}
              multiline
              numberOfLines={4}
              placeholderTextColor={COLORS.text.secondary}
            />

            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.text.secondary}
            />

            {/* Achievements Visibility Toggle */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name={achievementsPublic ? "eye" : "eye-off"} size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={{ color: COLORS.text.secondary, marginRight: 8 }}>
                Achievements {achievementsPublic ? "Public" : "Private"}
              </Text>
              <Switch
                value={achievementsPublic}
                onValueChange={setAchievementsPublic}
                trackColor={{ false: COLORS.grey, true: COLORS.primaryLight }}
                thumbColor={achievementsPublic ? COLORS.primary : '#f4f3f4'}
              />
            </View>

            <View style={styles.socialLinksSection}>
              <Text style={styles.sectionTitle}>Social Links</Text>
              {socialLinks.map((link, index) => (
                <View key={index} style={styles.socialLinkInput}>
                  <View style={styles.platformSelector}>
                    <TouchableOpacity
                      style={styles.platformButton}
                      onPress={() => {
                        Alert.alert(
                          'Select Platform',
                          'Choose a social media platform',
                          SOCIAL_PLATFORMS.map(platform => ({
                            text: platform.name,
                            onPress: () => handleUpdateSocialLink(index, platform.id)
                          })).concat([
                            { text: 'Cancel', style: 'cancel' }
                          ])
                        );
                      }}
                    >
                      {link.icon ? (
                        <Ionicons name={link.icon} size={20} color={COLORS.text.secondary} />
                      ) : (
                        <Text style={styles.platformPlaceholder}>Select Platform</Text>
                      )}
                    </TouchableOpacity>
                    <TextInput
                      style={styles.usernameInput}
                      value={link.username}
                      onChangeText={(text) => handleUpdateUsername(index, text)}
                      placeholder="Username"
                      placeholderTextColor={COLORS.text.secondary}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveSocialLink(index)}
                    >
                      <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addSocialButton}
                onPress={handleAddSocialLink}
              >
                <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.addSocialText}>Add Social Link</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  saveButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  socialLinksSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  socialLinkInput: {
    marginBottom: 12,
  },
  platformSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    width: 50,
    alignItems: 'center',
  },
  platformPlaceholder: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  usernameInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  removeButton: {
    padding: 12,
  },
  addSocialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: 8,
  },
  addSocialText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
}); 