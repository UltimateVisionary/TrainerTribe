import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';

import { useHealth } from './HealthContext';

function getDayLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function getAreaPath(data, width, height, minY, maxY) {
  const stepCount = data.length;
  const stepX = width / (stepCount - 1);
  const scaleY = val => height - ((val - minY) / (maxY - minY)) * height;
  let d = `M 0 ${scaleY(data[0].steps)}`;
  for (let i = 1; i < stepCount; i++) {
    const x = i * stepX;
    const y = scaleY(data[i].steps);
    d += ` L ${x} ${y}`;
  }
  // Close the path to the bottom
  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}

function getLinePath(data, width, height, minY, maxY) {
  const stepCount = data.length;
  const stepX = width / (stepCount - 1);
  const scaleY = val => height - ((val - minY) / (maxY - minY)) * height;
  let d = `M 0 ${scaleY(data[0].steps)}`;
  for (let i = 1; i < stepCount; i++) {
    const x = i * stepX;
    const y = scaleY(data[i].steps);
    d += ` L ${x} ${y}`;
  }
  return d;
}

export default function WeeklyStepsChart() {
  const { dailyStepsHistory } = useHealth() || {};
  // Show last 7 days, with fallback to 0 if missing
  const chartData = (dailyStepsHistory || []).map(entry => ({
    day: getDayLabel(entry.date),
    steps: entry.steps ?? 0,
  }));
  const chartWidth = 320;
  const chartHeight = 120;
  // Ensure at least two points and minY != maxY to avoid NaN errors
  if (!chartData || chartData.length < 2 || chartData.every(d => isNaN(d.steps))) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Steps</Text>
        <Text style={{textAlign: 'center', color: '#888'}}>Not enough data to display chart.</Text>
      </View>
    );
  }
  let minY = Math.min(...chartData.map(d => d.steps));
  let maxY = Math.max(...chartData.map(d => d.steps));
  if (minY === maxY) {
    // Avoid division by zero: expand the range
    minY = minY - 10;
    maxY = maxY + 10;
  }
  const areaPath = getAreaPath(chartData, chartWidth, chartHeight, minY, maxY);
  const linePath = getLinePath(chartData, chartWidth, chartHeight, minY, maxY);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Steps</Text>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2={chartHeight}>
            <Stop offset="0%" stopColor="#4169E1" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#4169E1" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#areaGradient)" />
        <Path d={linePath} fill="none" stroke="#4169E1" strokeWidth={2} />
      </Svg>
      <View style={styles.labelRow}>
        {chartData.map((d, i) => (
          <Text key={d.day + i} style={styles.label}>{d.day}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#225',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    marginTop: 4,
  },
  label: {
    color: '#4169E1',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
});
