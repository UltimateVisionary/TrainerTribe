import React, { useCallback, useState, useEffect } from 'react';
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
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

const SettingItem = ({ icon, title, subtitle, onPress, hasSwitch, value, onValueChange, showArrow = true, themedStyles, theme }) => (
  <TouchableOpacity 
    style={themedStyles.settingItem}
    onPress={onPress}
    disabled={hasSwitch}
  >
    <View style={themedStyles.settingIcon}>
      <Ionicons name={icon} size={22} color={theme.primary} />
    </View>
    <View style={themedStyles.settingContent}>
      <Text style={themedStyles.settingTitle}>{title}</Text>
      {subtitle && <Text style={themedStyles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {hasSwitch ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.grey, true: theme.primaryLight }}
        thumbColor={value ? theme.primary : '#f4f3f4'}
      />
    ) : showArrow ? (
      <Ionicons name="chevron-forward" size={20} color={theme.grey} />
    ) : null}
  </TouchableOpacity>
);

const SettingsSection = ({ title, children, themedStyles }) => (
  <View style={themedStyles.settingsSection}>
    <Text style={themedStyles.sectionTitle}>{title}</Text>
    <View style={themedStyles.sectionContent}>
      {children}
    </View>
  </View>
);

export default function SettingsScreen({ navigation }) {
  const { t, language, key: languageKey, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme.mode === 'dark');

  useEffect(() => {
    setDarkModeEnabled(theme.mode === 'dark');
  }, [theme]);

  const handleToggleDarkMode = () => {
    toggleTheme();
  };

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

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
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
      color: theme.primary,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    sectionContent: {
      backgroundColor: theme.card,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: theme.grey,
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
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    settingSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    logoutButton: {
      margin: 24,
      padding: 16,
      backgroundColor: theme.error + '22',
      borderRadius: 12,
      alignItems: 'center',
    },
    logoutText: {
      color: theme.error,
      fontSize: 16,
      fontWeight: '600',
    },
    versionText: {
      textAlign: 'center',
      color: theme.textSecondary,
      fontSize: 13,
      marginBottom: 24,
    },
  });

  return (
    <SafeAreaView style={themedStyles.container} key={languageKey}>
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={themedStyles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={themedStyles.content}>
        <SettingsSection title={t('account')} themedStyles={themedStyles}>
          <SettingItem
            icon="person-outline"
            title={t('personalInfo')}
            subtitle={t('updateProfile')}
            onPress={() => navigation.navigate('EditProfile')}
            themedStyles={themedStyles}
            theme={theme}
          />
          
          <SettingItem
            icon="card-outline"
            title={t('subscription')}
            subtitle={t('manageSubscription')}
            onPress={() => navigation.navigate('SubscriptionScreen')}
            themedStyles={themedStyles}
            theme={theme}
          />
          <SettingItem
            icon="pricetags-outline"
            title="Pricing"
            subtitle="View all plans"
            onPress={() => navigation.navigate('Pricing')}
            themedStyles={themedStyles}
            theme={theme}
          />
        </SettingsSection>

        <SettingsSection title={t('preferences')} themedStyles={themedStyles}>
          <SettingItem
            icon="language-outline"
            title={t('language')}
            subtitle={(() => {
              if (language === 'es') return t('spanish');
              if (language === 'zh') return t('chinese');
              return t('english');
            })()}
            onPress={() => navigation.navigate('Language')}
            themedStyles={themedStyles}
            theme={theme}
          />
          <SettingItem
            icon="notifications-outline"
            title={t('notifications')}
            hasSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            themedStyles={themedStyles}
            theme={theme}
          />
          <SettingItem
            icon="moon-outline"
            title={t('darkMode')}
            hasSwitch
            value={darkModeEnabled}
            onValueChange={handleToggleDarkMode}
            themedStyles={themedStyles}
            theme={theme}
          />
        </SettingsSection>
        <SettingsSection title={t('support')} themedStyles={themedStyles}>
          <SettingItem
            icon="help-circle-outline"
            title={t('helpCenter')}
            onPress={() => navigation.navigate('HelpCenterScreen')}
            themedStyles={themedStyles}
            theme={theme}
          />
          <SettingItem
            icon="document-text-outline"
            title={t('terms')}
            onPress={() => navigation.navigate('TermsOfServiceScreen')}
            themedStyles={themedStyles}
            theme={theme}
          />
          <SettingItem
            icon="lock-closed-outline"
            title={t('privacyPolicy')}
            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
            themedStyles={themedStyles}
            theme={theme}
          />
        </SettingsSection>

        <TouchableOpacity style={themedStyles.logoutButton} onPress={handleLogout}>
          <Text style={themedStyles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        <Text style={themedStyles.versionText}>{t('version')} 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}