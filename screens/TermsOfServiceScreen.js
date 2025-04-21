import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function TermsOfServiceScreen() {
  const { theme } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Terms of Service</Text>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Acceptance of Terms</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>By using TrainerTribe ("the App"), you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use our services.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Use of the App</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>You must be at least 13 years old to use the App. You agree to use the App only for lawful purposes and in accordance with these Terms.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Account Registration</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Subscriptions & Payments</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>Some features require a paid subscription. All payments are non-refundable except as required by law. You may cancel your subscription at any time in the app settings.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>5. User Content</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>You retain ownership of content you post but grant us a license to use, display, and distribute it within the App. You must not post unlawful or harmful content.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Prohibited Conduct</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>You agree not to:
- Violate any laws
- Infringe on intellectual property
- Harass or harm others
- Attempt to gain unauthorized access to our systems</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Disclaimer & Limitation of Liability</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>The App is provided "as is" without warranties. We are not liable for indirect or consequential damages. Use the App at your own risk.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>8. Modifications</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>We may update these Terms at any time. Continued use of the App after changes means you accept the new Terms.</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>9. Contact</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>If you have questions about these Terms, contact us at support@trainertribe.com.</Text>
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
