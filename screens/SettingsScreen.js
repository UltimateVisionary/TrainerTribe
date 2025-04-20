import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const SettingItem = ({ icon, title, subtitle, onPress, hasSwitch, value, onValueChange, showArrow = true }) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
    disabled={hasSwitch}
  >
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {hasSwitch ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.grey, true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : '#f4f3f4'}
      />
    ) : showArrow ? (
      <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
    ) : null}
  </TouchableOpacity>
);

const SettingsSection = ({ title, children }) => (
  <View style={styles.settingsSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Handle logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <SettingsSection title="Account">
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your profile details"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingItem
            icon="card-outline"
            title="Subscription"
            subtitle="Manage your subscription"
            onPress={() => navigation.navigate('Subscription')}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy"
            subtitle="Manage your privacy settings"
            onPress={() => navigation.navigate('Privacy')}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            hasSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            hasSwitch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => navigation.navigate('Language')}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => navigation.navigate('HelpCenter')}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Contact Us"
            onPress={() => navigation.navigate('ContactUs')}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => navigation.navigate('Terms')}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
        </SettingsSection>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
  },
  settingsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  logoutButton: {
    margin: 24,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.text.secondary,
    fontSize: 13,
    marginBottom: 24,
  },
}); 