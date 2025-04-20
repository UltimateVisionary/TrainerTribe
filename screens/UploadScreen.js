import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function UploadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Upload Content Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, color: '#111827' }
});
