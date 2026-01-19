import { WORD_LIST, OPTIMAL_STARTERS } from './wordlist.js';

// Feedback types
export const FEEDBACK = {
  CORRECT: 'correct',    // Green - letter in correct position
  PRESENT: 'present',    // Yellow - letter in word but wrong position
  ABSENT: 'absent'       // Gray - letter not in word
};

/**
 * Calculate feedback for a guess against a target word
 * @param {string} guess - The guessed word
 * @param {string} target - The target word (only used for demo/testing)
 * @returns {Array} Array of feedback for each letter
 */
export function calculateFeedback(guess, target) {
  const feedback = new Array(5).fill(FEEDBACK.ABSENT);
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const used = new Array(5).fill(false);

  // First pass: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback[i] = FEEDBACK.CORRECT;
      used[i] = true;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === FEEDBACK.CORRECT) continue;
    
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessLetters[i] === targetLetters[j]) {
        feedback[i] = FEEDBACK.PRESENT;
        used[j] = true;
        break;
      }
    }
  }

  return feedback;
}

/**
 * Filter possible words based on guess and feedback
 * @param {Array} words - List of possible words
 * @param {string} guess - The guessed word
 * @param {Array} feedback - Feedback for the guess
 * @returns {Array} Filtered list of possible words
 */
export function filterWords(words, guess, feedback) {
  return words.filter(word => {
    const wordLetters = word.split('');
    const guessLetters = guess.split('');

    // Check each position
    for (let i = 0; i < 5; i++) {
      const letter = guessLetters[i];
      const fb = feedback[i];

      if (fb === FEEDBACK.CORRECT) {
        // Letter must be in this exact position
        if (wordLetters[i] !== letter) return false;
      } else if (fb === FEEDBACK.PRESENT) {
        // Letter must be in word but not in this position
        if (wordLetters[i] === letter) return false;
        if (!word.includes(letter)) return false;
      } else if (fb === FEEDBACK.ABSENT) {
        // Letter must not be in word (unless it's correct/present elsewhere)
        const hasCorrectOrPresent = feedback.some((f, idx) => 
          guessLetters[idx] === letter && f !== FEEDBACK.ABSENT
        );
        
        if (!hasCorrectOrPresent) {
          if (word.includes(letter)) return false;
        } else {
          // Letter appears elsewhere as correct/present
          // So it shouldn't appear in THIS position
          if (wordLetters[i] === letter) return false;
          
          // Count occurrences
          const guessCount = guessLetters.filter((l, idx) => 
            l === letter && feedback[idx] !== FEEDBACK.ABSENT
          ).length;
          const wordCount = wordLetters.filter(l => l === letter).length;
          
          if (wordCount < guessCount) return false;
        }
      }
    }

    return true;
  });
}

/**
 * Calculate entropy/information gain for a word
 * Higher entropy means the word will give more information
 * @param {string} word - Word to evaluate
 * @param {Array} possibleWords - Current list of possible words
 * @returns {number} Entropy score
 */
export function calculateEntropy(word, possibleWords) {
  const patterns = new Map();

  // Simulate guessing this word against all possible answers
  for (const target of possibleWords) {
    const feedback = calculateFeedback(word, target);
    const pattern = feedback.join(',');
    patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
  }

  // Calculate entropy
  let entropy = 0;
  const total = possibleWords.length;
  
  for (const count of patterns.values()) {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

/**
 * Get the best next guess based on current possible words
 * @param {Array} possibleWords - Current list of possible words
 * @param {Array} allWords - Full word list for suggestions
 * @returns {string} Best word to guess next
 */
export function getBestGuess(possibleWords, allWords = WORD_LIST) {
  if (possibleWords.length === 0) {
    return OPTIMAL_STARTERS[0];
  }

  if (possibleWords.length === 1) {
    return possibleWords[0];
  }

  // For first guess, use optimal starter
  if (possibleWords.length === allWords.length) {
    return OPTIMAL_STARTERS[0];
  }

  // If few possibilities left, guess one of them
  if (possibleWords.length <= 2) {
    return possibleWords[0];
  }

  // Calculate entropy for each possible word
  // For performance, sample a subset if too many possibilities
  const wordsToTest = possibleWords.length > 50 
    ? [...possibleWords.slice(0, 30), ...OPTIMAL_STARTERS]
    : [...possibleWords, ...OPTIMAL_STARTERS.slice(0, 3)];

  let bestWord = wordsToTest[0];
  let bestEntropy = -1;

  for (const word of wordsToTest) {
    const entropy = calculateEntropy(word, possibleWords);
    if (entropy > bestEntropy) {
      bestEntropy = entropy;
      bestWord = word;
    }
  }

  return bestWord;
}

/**
 * Wordle Solver class to manage the solving process
 */
export class WordleSolver {
  constructor() {
    this.reset();
  }

  reset() {
    this.possibleWords = [...WORD_LIST];
    this.guesses = [];
    this.solved = false;
  }

  /**
   * Add a guess and its feedback to narrow down possibilities
   * @param {string} guess - The guessed word
   * @param {Array} feedback - Feedback for each letter
   */
  addGuess(guess, feedback) {
    this.guesses.push({ word: guess, feedback });
    this.possibleWords = filterWords(this.possibleWords, guess, feedback);
    
    // Check if solved
    if (feedback.every(f => f === FEEDBACK.CORRECT)) {
      this.solved = true;
    }
  }

  /**
   * Get the next best guess
   * @returns {string} Suggested next guess
   */
  getNextGuess() {
    return getBestGuess(this.possibleWords, WORD_LIST);
  }

  /**
   * Get current state
   * @returns {Object} Current solver state
   */
  getState() {
    return {
      possibleWords: this.possibleWords,
      possibleCount: this.possibleWords.length,
      guesses: this.guesses,
      solved: this.solved,
      nextGuess: this.solved ? null : this.getNextGuess()
    };
  }
}
