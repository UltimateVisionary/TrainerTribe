import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function EditProfileScreen({ navigation }) {
  const { theme } = useTheme();
  // Example state for editable fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [handle, setHandle] = useState('');
  const [achievementsPublic, setAchievementsPublic] = useState(true);
  const [followingPublic, setFollowingPublic] = useState(true);

  const handleSave = () => {
    // Here you would integrate with your backend or state management
    Alert.alert(
      'Profile Updated',
      `Your personal information has been updated.\n\nAchievements Public: ${achievementsPublic ? 'Yes' : 'No'}\nFollowing Public: ${followingPublic ? 'Yes' : 'No'}`
    );
    navigation.goBack();
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Edit Personal Information</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Name</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={theme.textSecondary}
      />
      <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor={theme.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={[styles.label, { color: theme.textSecondary }]}>Handle</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        value={handle}
        onChangeText={setHandle}
        placeholder="@yourhandle"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
      />
      <Text style={[styles.label, { color: theme.textSecondary }]}>Bio</Text>
      <TextInput
        style={[styles.input, styles.bioInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us about yourself"
        placeholderTextColor={theme.textSecondary}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
        <Text style={[styles.saveButtonText, { color: theme.white }]}>Save Changes</Text>
      </TouchableOpacity>

      {/* Privacy Info Section */}
      <View style={[styles.privacyBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.privacyTitle, { color: theme.primary }]}>Privacy Settings</Text>
        <Text style={[styles.privacyText, { color: theme.textSecondary }]}>You can control what personal information is visible to others and how your data is used in the app. For more details and to manage your privacy preferences, visit the Privacy Policy page.</Text>
        {/* Achievements Public Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', color: theme.text, fontSize: 16, marginRight: 8 }}>Achievements Public</Text>
          </View>
          <Switch
            value={achievementsPublic}
            onValueChange={setAchievementsPublic}
            trackColor={{ false: theme.grey, true: theme.primaryLight }}
            thumbColor={achievementsPublic ? theme.primary : '#f4f3f4'}
          />
        </View>

        {/* Following Public Section */}
        <View style={{ width: '100%', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '600', color: theme.text, fontSize: 16 }}>Following Public</Text>
            <Switch
              value={followingPublic}
              onValueChange={setFollowingPublic}
              trackColor={{ false: theme.grey, true: theme.primaryLight }}
              thumbColor={followingPublic ? theme.primary : '#f4f3f4'}
            />
          </View>
          {/* Optional description below toggle */}
          {/* <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>If off, your following count will be hidden from your public profile.</Text> */}
        </View>
        <TouchableOpacity style={[styles.privacyButton, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
          <Text style={[styles.privacyButtonText, { color: theme.white }]}>View Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  privacyBox: {
    marginTop: 32,
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  privacyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 14,
  },
  privacyButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  privacyButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  bioInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 28,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
