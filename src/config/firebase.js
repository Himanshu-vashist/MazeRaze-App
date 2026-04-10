import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * React Native Firebase is automatically configured using the
 * google-services.json (Android) and GoogleService-Info.plist (iOS) files.
 * This file exports the initialized services for use throughout the app.
 */

export const db = firestore();

// Placeholder for logic if needed
export default {
  db,
};
