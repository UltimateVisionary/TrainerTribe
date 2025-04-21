import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Privacy Policy</Text>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Introduction</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>TrainerTribe ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our fitness app and related services.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Information We Collect</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>We collect information you provide directly to us, such as your name, email address, profile information, fitness goals, and any content you submit. We may also collect usage data, device information, and cookies to improve your experience.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>3. How We Use Your Information</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>We use your information to:
- Provide and personalize our services
- Process subscriptions and payments
- Respond to your inquiries and provide support
- Improve our app and develop new features
- Send important updates and marketing communications (with your consent)</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Sharing Your Information</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>We do not sell your personal information. We may share your data with trusted third-party service providers only as necessary to operate our app (e.g., payment processors, analytics). All partners are required to keep your data secure and confidential.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Data Security</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>We use industry-standard security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Your Choices</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>You may update or delete your account information at any time in the app settings. You can opt out of marketing emails by following the instructions in those emails.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Children's Privacy</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us immediately.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>8. Changes to This Policy</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy in the app or via email.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>9. Contact Us</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>If you have any questions or concerns about this Privacy Policy, please contact us at support@trainertribe.com.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  body: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
});
