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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const stats = [
    { value: '50K+', label: 'Questions' },
    { value: '95%', label: 'Success Rate' },
    { value: '10+', label: 'Exams Covered' },
  ];

  const features = [
    { icon: 'nintendo-game-boy', title: 'Learn Like Playing', desc: 'Turn boring study sessions into exciting quests with XP, levels, and rewards.' },
    { icon: 'robot-outline', title: 'AI-Powered Paths', desc: 'Our Oracle analyzes your performance and creates personalized learning journeys.' },
    { icon: 'book-open-variant', title: 'Exam-Focused', desc: 'Content mapped to SSC, Banking, CAT, UPSC, and more competitive exams.' },
    { icon: 'chart-line-variant', title: 'Track Everything', desc: 'Detailed analytics show exactly where you excel and where to improve.' },
    { icon: 'sword-cross', title: 'Compete & Grow', desc: 'Weekly battles, leaderboards, and achievements keep you motivated.' },
    { icon: 'calendar-check', title: 'Daily Habits', desc: 'Streaks and daily sparks build the consistency that leads to success.' },
  ];

  const exams = [
    'SSC CGL', 'SSC CHSL', 'Bank PO', 'Bank Clerk', 
    'IBPS PO', 'RBI Grade B', 'CAT', 'XAT', 
    'UPSC Prelims', 'State PSC', 'Railways', 'CTET'
  ];

  const journeySteps = [
    { num: '01', title: 'Choose Your Path', desc: 'Select your target exam and subjects. Our Oracle creates a personalized roadmap.' },
    { num: '02', title: 'Learn & Practice', desc: 'Journey through concepts via Atlas, then test yourself in the Arena.' },
    { num: '03', title: 'Build Habits', desc: 'Complete Daily Sparks, maintain streaks, and earn XP for consistency.' },
    { num: '04', title: 'Track & Improve', desc: 'Mission Control shows your progress, strengths, and areas to focus on.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Gradient Background Orbs */}
      <View style={[styles.glowOrb, { top: -80, left: -80, backgroundColor: colors.primary }]} />
      <View style={[styles.glowOrb, { top: height * 0.4, right: -100, backgroundColor: colors.accent }]} />
      <View style={[styles.glowOrb, { bottom: -100, left: 50, backgroundColor: colors.error }]} />

      {/* Top Navbar */}
      <View style={styles.header}>
        <View style={styles.navBrandContainer}>
          <Icon name="maze" size={28} color={colors.primaryLight} style={{ marginRight: 8 }} />
          <Text style={styles.navBrand}>MazeRaze</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="logout" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>✨ Your journey to excellence starts here</Text>
          </View>
          
          <Text style={styles.heroTitle}>Master Aptitude.</Text>
          <Text style={[styles.heroTitle, { color: colors.primaryLight, marginBottom: 16 }]}>Dominate Exams.</Text>
          
          <Text style={styles.heroDesc}>
            The gamified platform that transforms competitive exam prep into an addictive journey. Learn smarter, track progress, and conquer your goals.
          </Text>

          <View style={styles.heroBtns}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('MemoryVault')} activeOpacity={0.8}>
              <LinearGradient colors={colors.primaryGradient} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.primaryBtnText}>Start Your Quest</Text>
                <Icon name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
              <Icon name="play-circle-outline" size={22} color={colors.textPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Watch Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsSection}>
          <View style={styles.statsGlass}>
            {stats.map((stat, idx) => (
              <View key={idx} style={styles.statBox}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* WHY CHOOSE MAZERAZE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why Choose MazeRaze?</Text>
          <Text style={styles.sectionSubtitle}>We've reimagined exam preparation as an adventure, not a chore.</Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((item, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.iconWrapper}>
                <Icon name={item.icon} size={28} color={colors.primaryLight} />
              </View>
              <Text style={styles.featureCardTitle}>{item.title}</Text>
              <Text style={styles.featureCardDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* EXAMS WE COVER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exams We Cover</Text>
          <Text style={styles.sectionSubtitle}>Comprehensive content tailored for India's top competitive examinations.</Text>
        </View>
        
        <View style={styles.examsWrap}>
          {exams.map((exam, idx) => (
            <View key={idx} style={styles.examChip}>
              <Text style={styles.examText}>{exam}</Text>
            </View>
          ))}
        </View>

        {/* YOUR JOURNEY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Journey to Success</Text>
          <Text style={styles.sectionSubtitle}>A simple, proven system that works.</Text>
        </View>
        
        <View style={styles.journeyContainer}>
          {journeySteps.map((step, index) => (
            <View key={index} style={styles.journeyStep}>
              <View style={styles.journeyNumContainer}>
                <Text style={styles.journeyNum}>{step.num}</Text>
              </View>
              <View style={styles.journeyContent}>
                <Text style={styles.journeyTitle}>{step.title}</Text>
                <Text style={styles.journeyDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA FOOTER */}
        <View style={styles.ctaSection}>
          <LinearGradient colors={colors.darkGradient} style={styles.ctaGlass} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.ctaSubtitle}>Join 10,000+ successful aspirants</Text>
            <Text style={styles.ctaTitle}>Ready to Transform Your{'\n'}Exam Preparation?</Text>
            
            <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('MemoryVault')} activeOpacity={0.8}>
              <LinearGradient colors={colors.primaryGradient} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.primaryBtnText}>Launch Your Quest</Text>
                <Icon name="rocket-launch" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12', // Slightly deeper black than old #0F0F1A
  },
  glowOrb: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.1,
    transform: [{ scale: 1.5 }],
    filter: 'blur(40px)',   
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
    backgroundColor: 'rgba(10, 10, 18, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  navBrandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBrand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  logoutBtn: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: 'flex-start',
  },
  badgeContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  badgeText: {
    color: colors.primaryLight,
    fontWeight: '600',
    fontSize: 13,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 52,
    letterSpacing: -1,
  },
  heroDesc: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '400',
  },
  heroBtns: {
    flexDirection: 'column',
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  secondaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  statsGlass: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(30, 30, 46, 0.6)',
    borderRadius: 24,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryLight,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  featuresGrid: {
    paddingHorizontal: 24,
    flexDirection: 'column',
    gap: 16,
    marginBottom: 48,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  featureCardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  examsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 48,
    gap: 12,
    justifyContent: 'center',
  },
  examChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  examText: {
    color: colors.primaryLight,
    fontWeight: '600',
    fontSize: 14,
  },
  journeyContainer: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  journeyStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  journeyNumContainer: {
    marginRight: 20,
    alignItems: 'center',
  },
  journeyNum: {
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.15)',
    fontStyle: 'italic',
  },
  journeyContent: {
    flex: 1,
    paddingTop: 6,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  journeyDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  ctaSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  ctaGlass: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ctaSubtitle: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 36,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
});

export default HomeScreen;
