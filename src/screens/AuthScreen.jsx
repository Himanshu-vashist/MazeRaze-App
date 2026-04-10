import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Alert,
    ActivityIndicator,
    Image,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { saveUserToFirestore, handleGoogleSignIn, resetPassword } from '../services/authService';
import { colors } from '../theme/colors';

const LogoImg = require('../assets/images/mazeRaze.png');

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
    // State
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    // Animations
    const slideAnim = useRef(new Animated.Value(0)).current; // 0 for Login, 1 for Signup
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: isLogin ? 0 : 1,
                duration: 350,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ])
        ]).start();
    }, [isLogin]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAction = async () => {
        if (!email || !password || (!isLogin && (!confirmPassword || !name))) {
            Alert.alert('Hold on', 'Please fill in all requested fields.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please provide a valid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            Alert.alert('Mismatch', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                await auth().signInWithEmailAndPassword(email, password);
            } else {
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                await user.updateProfile({ displayName: name });
                await saveUserToFirestore(user.uid, {
                    name,
                    email,
                    role: 'user',
                    subscriptionStatus: 'free',
                    authProvider: 'email',
                });
            }
            // App.tsx auth state listener handles navigation
        } catch (error) {
            console.error('Auth Error:', error);
            let msg = isLogin ? 'Login failed.' : 'Signup failed.';
            if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
            else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') msg = 'Invalid credentials.';
            else if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
            
            Alert.alert('Authentication Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignInPress = async () => {
        setGoogleLoading(true);
        try {
            const result = await handleGoogleSignIn();
            if (!result.success) {
                Alert.alert('Google Sign-In Failed', result.error || 'An error occurred.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to sign in with Google.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSendResetEmail = async () => {
        if (!resetEmail || !validateEmail(resetEmail)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }
        setLoading(true);
        const result = await resetPassword(resetEmail);
        setLoading(false);
        if (result.success) {
            Alert.alert('Success', 'Password reset email sent! Please check your inbox.');
            setShowForgotPassword(false);
            setResetEmail('');
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
    };

    const renderInput = (icon, placeholder, value, onChange, secureTextEntry = false, showToggle = false, toggleState = null, setToggleState = null) => (
        <View style={styles.inputContainer}>
            <Icon name={icon} size={22} color={colors.primaryLight} style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChange}
                secureTextEntry={secureTextEntry}
                autoCapitalize={placeholder.includes('Email') ? 'none' : 'words'}
                keyboardType={placeholder.includes('Email') ? 'email-address' : 'default'}
            />
            {showToggle && (
                <TouchableOpacity onPress={() => setToggleState(!toggleState)} style={styles.eyeIcon}>
                    <Icon name={toggleState ? 'eye-off' : 'eye'} size={22} color={colors.textMuted} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <LinearGradient colors={colors.darkGradient} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                
                {/* Decorative Background Elements */}
                <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: colors.primary }]} />
                <View style={[styles.glowOrb, { bottom: height * 0.1, right: -100, backgroundColor: colors.accent }]} />

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        
                        {/* Header */}
                        <View style={styles.header}>
                            <Image source={LogoImg} style={styles.logo} resizeMode="contain" />
                            <Text style={styles.brandTitle}>MazeRaze</Text>
                            <Text style={styles.brandSubtitle}>Escape the ordinary. Master your mind.</Text>
                        </View>

                        {/* Content Container (Glassmorphism Effect) */}
                        <View style={styles.glassCard}>
                            
                            {showForgotPassword ? (
                                <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
                                    <Text style={styles.cardTitle}>Reset Password</Text>
                                    <Text style={styles.cardSubtitle}>Enter your email to receive a reset link.</Text>
                                    
                                    {renderInput('email', 'Email Address', resetEmail, setResetEmail)}
                                    
                                    <TouchableOpacity style={styles.mainBtn} onPress={handleSendResetEmail} disabled={loading}>
                                        <LinearGradient colors={colors.primaryGradient} style={styles.mainBtnGradient} start={{x:0, y:0}} end={{x:1, y:0}}>
                                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>Send Link</Text>}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.secondaryLink} onPress={() => setShowForgotPassword(false)}>
                                        <Icon name="arrow-left" size={16} color={colors.textSecondary} />
                                        <Text style={styles.secondaryLinkText}> Back to Login</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ) : (
                                <>
                                    {/* Custom Tab Switcher */}
                                    <View style={styles.tabContainer}>
                                        <Animated.View style={[
                                            styles.activeTabIndicator,
                                            {
                                                transform: [{
                                                    translateX: slideAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, (width - 80) / 2] // 80 is container padding combined
                                                    })
                                                }]
                                            }
                                        ]} />
                                        <TouchableOpacity style={styles.tabBtn} onPress={() => !isLogin && toggleMode()} activeOpacity={0.8}>
                                            <Text style={[styles.tabBtnText, isLogin && styles.activeTabBtnText]}>Log In</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.tabBtn} onPress={() => isLogin && toggleMode()} activeOpacity={0.8}>
                                            <Text style={[styles.tabBtnText, !isLogin && styles.activeTabBtnText]}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
                                        {!isLogin && renderInput('account', 'Full Name', name, setName)}
                                        {renderInput('email', 'Email Address', email, setEmail)}
                                        {renderInput('lock', 'Password', password, setPassword, !showPassword, true, showPassword, setShowPassword)}
                                        {!isLogin && renderInput('lock-check', 'Confirm Password', confirmPassword, setConfirmPassword, !showConfirmPassword, true, showConfirmPassword, setShowConfirmPassword)}
                                        
                                        {isLogin && (
                                            <TouchableOpacity style={styles.forgotBtn} onPress={() => setShowForgotPassword(true)}>
                                                <Text style={styles.forgotBtnText}>Forgot Password?</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity style={styles.mainBtn} onPress={handleAction} disabled={loading || googleLoading}>
                                            <LinearGradient colors={colors.primaryGradient} style={styles.mainBtnGradient} start={{x:0, y:0}} end={{x:1, y:0}}>
                                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>{isLogin ? 'Log In' : 'Create Account'}</Text>}
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        <View style={styles.dividerBox}>
                                            <View style={styles.line} />
                                            <Text style={styles.dividerText}>OR</Text>
                                            <View style={styles.line} />
                                        </View>

                                        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignInPress} disabled={loading || googleLoading}>
                                            {googleLoading ? <ActivityIndicator color={colors.primary} /> : (
                                                <>
                                                    <Icon name="google" size={24} color="#EA4335" style={{ marginRight: 10 }} />
                                                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </Animated.View>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        position: 'relative',
    },
    glowOrb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.15,
        transform: [{ scale: 1.5 }],
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: height * 0.08,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 24,
        marginBottom: 16,
    },
    brandTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    brandSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
        letterSpacing: 0.5,
    },
    glassCard: {
        width: '100%',
        backgroundColor: 'rgba(30, 30, 46, 0.6)',
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(15, 15, 26, 0.6)',
        borderRadius: 16,
        height: 54,
        marginBottom: 26,
        position: 'relative',
    },
    activeTabIndicator: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    tabBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeTabBtnText: {
        color: '#FFFFFF',
    },
    formWrapper: {
        width: '100%',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 15, 26, 0.5)',
        borderRadius: 16,
        height: 60,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotBtnText: {
        color: colors.primaryLight,
        fontSize: 14,
        fontWeight: '600',
    },
    mainBtn: {
        width: '100%',
        height: 60,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    mainBtnGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    secondaryLinkText: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: '600',
    },
    dividerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        color: colors.textMuted,
        marginHorizontal: 16,
        fontSize: 13,
        fontWeight: '500',
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        height: 60,
        borderRadius: 16,
    },
    googleBtnText: {
        color: '#111',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AuthScreen;
