import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.brandTitle}>MazeRaze</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Feature Cards */}
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        
        <TouchableOpacity
          style={styles.mainFeatureCard}
          onPress={() => navigation.navigate('MemoryVault')}
        >
          <View style={styles.featureIconContainer}>
            <Text style={styles.featureEmoji}>💎</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Memory Vault</Text>
            <Text style={styles.featureDescription}>Master 45 new words today</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '40%' }]} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryFeatureCard}>
          <View style={[styles.miniIcon, { backgroundColor: '#10B981' }]}>
            <Text style={styles.miniEmoji}>⚡</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.featureTitle}>Daily Challenge</Text>
            <Text style={styles.featureDescription}>Quick 5-minute session</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryFeatureCard}>
          <View style={[styles.miniIcon, { backgroundColor: '#F59E0B' }]}>
            <Text style={styles.miniEmoji}>📊</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.featureTitle}>Insights</Text>
            <Text style={styles.featureDescription}>View your learning progress</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statCard: {
    width: (width - 64) / 2,
    backgroundColor: '#1E1E2E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  mainFeatureCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  secondaryFeatureCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  miniIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  miniEmoji: {
    fontSize: 20,
  },
  flex1: {
    flex: 1,
  },
});

export default HomeScreen;
