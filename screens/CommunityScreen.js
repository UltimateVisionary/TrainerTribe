import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useLanguage } from '../LanguageContext';

import { useMemo } from 'react';

const CommunityScreen = ({ navigation }) => {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('community')}</Text>
        <TouchableOpacity 
          style={[styles.newChatButton, { backgroundColor: COLORS.primary + '15' }]}
          onPress={() => {
            // Navigate to root stack screen
            navigation.getParent()?.navigate('SearchUsers');
          }}
        >
          <Ionicons name="person-add-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {/* Add your tabs and content here */}
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  newChatButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default CommunityScreen; 