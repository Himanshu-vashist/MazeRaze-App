import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
// Web Client ID from Firebase Console (OAuth client from google-services.json)
GoogleSignin.configure({
    webClientId: '1007545154801-056sg0jcs9lm3ocjncfk9vqtdsl3631c.apps.googleusercontent.com',
    offlineAccess: true,
});

export const saveUserToFirestore = async (userId, userData) => {
    try {
        await firestore()
            .collection('users')
            .doc(userId)
            .set({
                ...userData,
                createdAt: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error saving user to Firestore:', error);
        return { success: false, error: error.message };
    }
};

export const getUserFromFirestore = async (userId) => {
    try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
            return { success: true, data: userDoc.data() };
        }
        return { success: false, error: 'User not found' };
    } catch (error) {
        console.error('Error fetching user from Firestore:', error);
        return { success: false, error: error.message };
    }
};

export const handleGoogleSignIn = async () => {
    try {
        // Sign out any existing Google session first to avoid conflicts
        try {
            await GoogleSignin.signOut();
        } catch (signOutError) {
            console.log('No previous session to sign out:', signOutError.message);
        }
        
        // Check if device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
        // Sign in with Google
        const signInResult = await GoogleSignin.signIn();
        console.log('Google Sign-In Result:', signInResult);
        
        // Get the Google ID token - handle both v16+ and older API versions
        const idToken = signInResult.data?.idToken || signInResult.idToken;
        
        if (!idToken) {
            console.error('Sign in result:', JSON.stringify(signInResult, null, 2));
            throw new Error('No ID token received from Google. Please ensure Google Sign-In is properly configured in Firebase Console.');
        }
        
        console.log('ID Token received, creating Firebase credential...');
        
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        
        console.log('Signing in to Firebase with Google credential...');
        
        // Sign-in the user with the credential
        const userCredential = await auth().signInWithCredential(googleCredential);
        const user = userCredential.user;
        
        console.log('Firebase sign-in successful for user:', user.email);
        
        // Save user to Firestore
        const userData = {
            name: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL,
            role: 'user',
            subscriptionStatus: 'free',
            authProvider: 'google',
        };
        
        await saveUserToFirestore(user.uid, userData);
        
        return {
            success: true,
            user: {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                ...userData,
            }
        };
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        
        let errorMessage = 'An error occurred during Google Sign-In';
        
        // Handle GoogleSignin specific errors
        if (error.code === 'sign_in_cancelled' || error.code === '-5') {
            errorMessage = 'Sign in cancelled';
        } else if (error.code === 'in_progress') {
            errorMessage = 'Sign in already in progress';
        } else if (error.code === 'play_services_not_available') {
            errorMessage = 'Play services not available or outdated';
        } else if (error.code === '12501') {
            errorMessage = 'Sign in cancelled. Please try again.';
        } else if (error.code === 'DEVELOPER_ERROR' || error.code === '10') {
            errorMessage = 'Google Sign-In configuration error. Please ensure SHA-1 fingerprint is added to Firebase Console.';
        }
        // Handle Firebase Auth errors
        else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with the same email but different sign-in credentials';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'The credential is invalid. Please ensure Google Sign-In is properly configured.';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Google Sign-In is not enabled in Firebase Console';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This user account has been disabled';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message) {
            // Return the actual error message for debugging
            errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
    }
};
export const updateUserInFirestore = async (userId, userData) => {
    try {
        await firestore()
            .collection('users')
            .doc(userId)
            .update(userData);
        return { success: true };
    } catch (error) {
        console.error('Error updating user in Firestore:', error);
        return { success: false, error: error.message };
    }
};

export const resetPassword = async (email) => {
    try {
        await auth().sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        let errorMessage = 'Failed to send password reset email';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many requests. Please try again later';
        }
        
        return { success: false, error: errorMessage };
    }
};
