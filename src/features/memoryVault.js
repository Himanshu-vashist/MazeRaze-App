import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { memoryVaultService } from '../services/memoryVaultService';
import MemoryCard from '../components/MemoryCard';
import SessionProgress from '../components/SessionProgress';

const { width } = Dimensions.get('window');
const USER_ID = 'test_user_123'; // Placeholder for auth

/**
 * Fisher-Yates Shuffle Algorithm
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MemoryVault = () => {
  // Session State
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Decks on Mount
  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await memoryVaultService.fetchDecks();
        setDecks(data);
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDecks();
  }, []);

  /**
   * Start a session for a specific deck
   */
  const startSession = async (deck) => {
    setIsLoading(true);
    try {
      const [allCards, revisionPoolIds] = await Promise.all([
        memoryVaultService.fetchCards(deck.id),
        memoryVaultService.getRevisionPool(USER_ID),
      ]);

      // Shuffle regular cards
      const shuffledRegular = shuffleArray(allCards);

      // Filter and shuffle revision cards
      const revisionCards = allCards.filter(c => revisionPoolIds.includes(c.id));
      const shuffledRevision = shuffleArray(revisionCards);

      // Interleave Logic: Insert revision cards at random positions
      const finalQueue = [...shuffledRegular];
      shuffledRevision.forEach(card => {
        const pos = Math.floor(Math.random() * (finalQueue.length + 1));
        finalQueue.splice(pos, 0, { ...card, isRevision: true });
      });

      setQueue(finalQueue);
      setActiveDeck(deck);
      setCurrentIndex(0);
      setScore(0);
      setIsComplete(false);
      setIsFlipped(false);
      setSelectedOption(null);
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Option Selection
   */
  const handleOptionSelect = (index) => {
    if (isFlipped) return;
    setSelectedOption(index);
    setTimeout(() => setIsFlipped(true), 1000);
  };

  /**
   * Move to Next Card
   */
  const handleNext = async () => {
    const currentCard = queue[currentIndex];
    const isCorrect = selectedOption === currentCard.correctIndex;

    // Update Score
    if (isCorrect) setScore(s => s + 1);

    // Persistence Logic: Update Revision Pool in Firestore
    try {
      if (!isCorrect) {
        // Add to revision pool if incorrect
        await memoryVaultService.addToRevisionPool(USER_ID, currentCard.id);
      } else if (currentCard.isRevision) {
        // Remove from revision pool if it was a revision card and answered correctly
        await memoryVaultService.removeFromRevisionPool(USER_ID, currentCard.id);
      }
    } catch (error) {
      console.error('Error updating revision pool:', error);
    }

    // Move to next or finish
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(c => c + 1);
      setIsFlipped(false);
      setSelectedOption(null);
    } else {
      setIsComplete(true);
    }
  };

  /**
   * Reset Session
   */
  const exitSession = () => {
    setActiveDeck(null);
    setQueue([]);
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading Vault...</Text>
      </View>
    );
  }

  // --- Render Selection Screen ---
  if (!activeDeck) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.selectionScroll}>
          <View style={styles.header}>
            <Text style={styles.title}>Memory Vault</Text>
            <Text style={styles.subtitle}>Master your knowledge through flashcards</Text>
          </View>

          <View style={styles.deckGrid}>
            {decks.map((deck) => (
              <TouchableOpacity
                key={deck.id}
                style={styles.deckCard}
                onPress={() => startSession(deck)}
              >
                <View style={[styles.deckIcon, { backgroundColor: deck.color || '#6366F1' }]} />
                <Text style={styles.deckName}>{deck.name}</Text>
                <Text style={styles.deckStats}>{deck.cardCount || 0} Cards</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Render Results Screen ---
  if (isComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsEmoji}>🏆</Text>
          <Text style={styles.resultsTitle}>Session Complete!</Text>
          <View style={styles.scoreBoard}>
            <Text style={styles.scoreLabel}>Final Score</Text>
            <Text style={styles.scoreValue}>{score} / {queue.length}</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={exitSession}>
            <Text style={styles.primaryButtonText}>Back to Vault</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Render Session Screen ---
  const currentCard = queue[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sessionHeader}>
        <TouchableOpacity onPress={exitSession}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
        <Text style={styles.deckTitle}>{activeDeck.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.sessionContent}>
        <SessionProgress
          current={currentIndex + 1}
          total={queue.length}
          score={score}
        />

        {currentCard.isRevision && (
          <View style={styles.revisionBadge}>
            <Text style={styles.revisionBadgeText}>REVISION MODE</Text>
          </View>
        )}

        <MemoryCard
          question={currentCard.question}
          answer={currentCard.options[currentCard.correctIndex]}
          explanation={currentCard.explanation}
          options={currentCard.options}
          correctIndex={currentCard.correctIndex}
          isFlipped={isFlipped}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
        />

        {isFlipped && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < queue.length - 1 ? 'Next Card' : 'Finish Session'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  selectionScroll: {
    padding: 24,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 24,
  },
  deckGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deckCard: {
    width: (width - 68) / 2,
    backgroundColor: '#1E1E2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  deckIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginBottom: 16,
  },
  deckName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deckStats: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  exitText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: '600',
  },
  deckTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sessionContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  revisionBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  revisionBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nextButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  resultsEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  scoreBoard: {
    alignItems: 'center',
    marginBottom: 60,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#10B981',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default MemoryVault;