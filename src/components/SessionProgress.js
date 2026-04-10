import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const SessionProgress = ({ current, total, score }) => {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <Text style={styles.progressText}>
          Card {current} of {total}
        </Text>
        <Text style={styles.scoreText}>
          Score: {score}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
});

export default SessionProgress;
