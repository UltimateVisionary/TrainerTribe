import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';
import { COLORS } from '../constants/colors';
import * as Localization from 'expo-localization';



export default function LanguageScreen({ navigation }) {
  const { t, language, setLanguage } = useLanguage();
  const SUPPORTED_LANGUAGES = [
    { code: 'en', label: t('english') },
    { code: 'es', label: t('spanish') },
    { code: 'zh', label: t('chinese') },
  ];
  const [selected, setSelected] = useState(language);

  const handleSelect = (code) => {
    setLanguage(code);
    setSelected(code);
    // Optionally, persist the language selection (e.g., AsyncStorage)
    // navigation.goBack(); // Removed for instant feedback
  };

  // Only render supported languages
  const LANGUAGES = SUPPORTED_LANGUAGES;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('selectLanguage')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.languageList}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.languageItem, selected === lang.code && styles.languageItemSelected]}
            onPress={() => handleSelect(lang.code)}
          >
            <Text style={styles.languageLabel}>{lang.label}</Text>
            {selected === lang.code && (
              <Ionicons name="checkmark" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  languageList: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  languageItemSelected: {
    backgroundColor: COLORS.primaryLight + '20',
  },
  languageLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
});
