import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../LanguageContext';

import { useMemo } from 'react';

export default function NotificationsScreen() {
  const { t, language, key: languageKey } = useLanguage();
  return (
    <SafeAreaView style={styles.container} key={languageKey}>
      <Text style={styles.text}>{t('notifications') || 'Notifications'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, color: '#111827' }
});
