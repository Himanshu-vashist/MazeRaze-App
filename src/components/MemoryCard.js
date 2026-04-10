import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const MemoryCard = ({
  question,
  answer,
  explanation,
  options,
  onOptionSelect,
  isFlipped,
  selectedOption,
  correctIndex,
}) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, { duration: 500 });
  }, [isFlipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      zIndex: rotation.value <= 90 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      zIndex: rotation.value > 90 ? 1 : 0,
    };
  });

  return (
    <View style={styles.cardContainer}>
      {/* Front Side */}
      <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && styles.selectedOption,
              ]}
              onPress={() => onOptionSelect(index)}
              disabled={isFlipped}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === index && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>
            {selectedOption === correctIndex ? 'Correct! 🎉' : 'Keep Learning!'}
          </Text>
        </View>
        <Text style={styles.answerLabel}>Correct Answer:</Text>
        <Text style={styles.answerText}>{answer}</Text>
        <View style={styles.divider} />
        <Text style={styles.explanationTitle}>Explanation:</Text>
        <Text style={styles.explanationText}>{explanation}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#1E1E2E',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  frontCard: {
    justifyContent: 'center',
  },
  backCard: {
    backgroundColor: '#252538',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366F1',
  },
  optionText: {
    fontSize: 16,
    color: '#D1D1D1',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366F1',
  },
  answerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  answerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: '#D1D1D1',
    lineHeight: 22,
  },
});

export default MemoryCard;
