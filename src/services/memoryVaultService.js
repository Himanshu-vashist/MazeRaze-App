import firestore from '@react-native-firebase/firestore';

const DECKS_COLLECTION = 'decks';
const REVISION_POOL_COLLECTION = 'revision_pool';
const USERS_COLLECTION = 'users';

/**
 * Service to handle Firestore operations for Memory Vault.
 */
export const memoryVaultService = {
  /**
   * Fetch all available flashcard decks.
   */
  async fetchDecks() {
    const snapshot = await firestore().collection(DECKS_COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Fetch cards for a specific deck.
   */
  async fetchCards(deckId) {
    const snapshot = await firestore()
      .collection(DECKS_COLLECTION)
      .doc(deckId)
      .collection('cards')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Fetch the user's revision pool.
   */
  async getRevisionPool(userId) {
    const snapshot = await firestore()
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(REVISION_POOL_COLLECTION)
      .get();
    return snapshot.docs.map(doc => doc.data().cardId);
  },

  /**
   * Add a card to the user's revision pool.
   */
  async addToRevisionPool(userId, cardId) {
    await firestore()
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(REVISION_POOL_COLLECTION)
      .doc(cardId)
      .set({
        cardId,
        addedAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Remove a card from the user's revision pool.
   */
  async removeFromRevisionPool(userId, cardId) {
    await firestore()
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(REVISION_POOL_COLLECTION)
      .doc(cardId)
      .delete();
  },
};
