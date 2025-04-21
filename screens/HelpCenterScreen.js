import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function HelpCenterScreen() {
  const { theme } = useTheme();

  const faqData = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Profile > Settings > Change Password and follow the prompts.',
    },
    {
      question: 'How do I manage my subscription?',
      answer: 'Visit Settings > Subscription to view, change, or cancel your plan.',
    },
    {
      question: 'How do I contact support?',
      answer: 'Email us at support@trainertribe.com or use the 24/7 Support Line below.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'Please email support@trainertribe.com with your request, and our team will assist you.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to Settings > Personal Info to update your details.',
    },
    {
      question: 'How do I turn notifications on or off?',
      answer: 'Go to Settings > Preferences > Notifications to manage your notification preferences.',
    },
    {
      question: 'What should I do if the app is not working?',
      answer: 'Try closing and reopening the app, or reinstall it. If the issue continues, contact support.',
    },
    {
      question: 'How do I request a refund?',
      answer: 'For refund requests, please email support@trainertribe.com with your order details.',
    },
    {
      question: 'Where can I find new features?',
      answer: 'Check out our Explore and Community tabs for the latest features and updates!',
    },
    {
      question: 'Is there a way to chat with support?',
      answer: 'Yes! Use our 24/7 Support Line below for instant answers to common support questions, or email us for further help.',
    },
  ];

  const renderFAQ = ({ item }) => (
    <View style={{ position: 'relative' }}>
      <View style={[styles.faqGlow, styles.faqGlowTopLeft]} pointerEvents="none" />
      <View style={[styles.faqGlow, styles.faqGlowBottomRight]} pointerEvents="none" />
      <View style={styles.faqCard}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Help Center</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>Welcome to the TrainerTribe Help Center. Here you’ll find answers to common questions, troubleshooting tips, and ways to get in touch with support.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Support</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>If your question isn’t answered below, reach out to our support team. We’re here to help!</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => Linking.openURL('mailto:support@trainertribe.com')}>
        <Text style={[styles.buttonText, { color: theme.white }]}>Email Support</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 28, textAlign: 'center' }]}>Frequently Asked Questions</Text>
    </View>
  );

  return (
    <FlatList
      data={faqData}
      keyExtractor={(item, idx) => idx.toString()}
      renderItem={renderFAQ}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 28 }]}>24/7 Support Line</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>Get instant answers to your support questions using our chatbot below. The bot is available 24/7 for TrainerTribe support topics.</Text>
          <View style={{ minHeight: 280, marginTop: 12 }}>
            {React.createElement(require('../components/SupportChatBot').default)}
          </View>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 24 }}
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  faqGlow: {
    position: 'absolute',
    borderRadius: 24,
    zIndex: 0,
    opacity: 0.45,
  },
  faqGlowTopLeft: {
    width: 38,
    height: 38,
    top: -14,
    left: -14,
    backgroundColor: '#3b82f6', // bright blue
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  faqGlowBottomRight: {
    width: 38,
    height: 38,
    bottom: -14,
    right: -14,
    backgroundColor: '#2563eb', // deeper blue
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  faqGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 20,
    backgroundColor: 'rgba(88, 101, 242, 0.38)', // blue-purple
    shadowColor: '#5865f2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 0,
    // For iOS: soft blur, for Android: fallback to shadow
  },
  container: {
    padding: 24,
    paddingBottom: 64,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 18,
    marginBottom: 4,
  },
  faqList: {
    marginVertical: 12,
  },
  faqCard: {
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  faqQuestion: {
    fontWeight: '600',
    fontSize: 16,
    color: '#3a3a3a',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 15,
    color: '#6c6c6c',
    lineHeight: 21,
  },
  body: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
  button: {
    marginTop: 18,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
