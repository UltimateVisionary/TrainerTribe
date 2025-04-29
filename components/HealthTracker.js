import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Bar from 'react-native-progress/Bar';
import { useHealth } from './HealthContext';

export default function HealthTracker() {
  const { steps, calories, tokens } = useHealth() || {};

  // Example targets
  const stepGoal = 10000;
  const calorieGoal = 2500;

  const stepProgress = Math.min(steps / stepGoal, 1);
  const calorieProgress = Math.min(calories / calorieGoal, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Health Stats</Text>
      <View style={styles.statRow}>
        <Text style={styles.label}>Steps:</Text>
        <Text style={styles.value}>{steps ?? 0} / {stepGoal}</Text>
      </View>
      <Bar progress={stepProgress} width={null} height={8} borderRadius={4} color="#4169E1" unfilledColor="#e6e6e6" style={styles.progressBar} />
      <View style={styles.statRow}>
        <Text style={styles.label}>Calories:</Text>
        <Text style={styles.value}>{calories ?? 0} / {calorieGoal}</Text>
      </View>
      <Bar progress={calorieProgress} width={null} height={8} borderRadius={4} color="#FFB347" unfilledColor="#e6e6e6" style={styles.progressBar} />
      <View style={styles.statRow}>
        <Text style={styles.label}>Tribe Tokens:</Text>
        <Text style={styles.value}>{tokens ?? 0}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafd',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
    color: '#225',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 15,
    color: '#555',
  },
  value: {
    fontWeight: '600',
    fontSize: 15,
    color: '#225',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
});
