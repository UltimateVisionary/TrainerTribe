import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../LanguageContext';

import { useMemo } from 'react';

export default function UploadScreen() {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{t('upload') || 'Upload'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, color: '#111827' }
});
