<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { FEEDBACK } from '../solver.js'

const props = defineProps({
  suggestion: String,
  solved: Boolean,
  possibleWords: Array,
  hasGuesses: Boolean,
  currentGuess: String,
  currentFeedback: Array
})

const emit = defineEmits(['submit', 'reset', 'use-suggestion', 'edit-last', 'update:current-guess', 'update:current-feedback'])

const showPossibleWords = ref(false)

watch(() => props.suggestion, (newVal) => {
  if (props.currentFeedback.length === 0) {
    emit('update:current-guess', '')
  }
})

function useSuggestion() {
  emit('update:current-guess', props.suggestion)
  emit('update:current-feedback', Array(5).fill(FEEDBACK.ABSENT))
}

function toggleFeedback(index) {
  if (props.currentGuess.length !== 5) return
  
  const newFeedback = [...props.currentFeedback]
  
  if (!newFeedback[index]) {
    newFeedback[index] = FEEDBACK.ABSENT
  } else if (newFeedback[index] === FEEDBACK.ABSENT) {
    newFeedback[index] = FEEDBACK.PRESENT
  } else if (newFeedback[index] === FEEDBACK.PRESENT) {
    newFeedback[index] = FEEDBACK.CORRECT
  } else {
    newFeedback[index] = FEEDBACK.ABSENT
  }
  
  emit('update:current-feedback', newFeedback)
}

function submitFeedback() {
  if (props.currentGuess.length !== 5) {
    alert('Please enter a 5-letter word')
    return
  }
  
  if (props.currentFeedback.length !== 5) {
    alert('Please set feedback for all letters')
    return
  }
  
  emit('submit', props.currentGuess.toLowerCase(), props.currentFeedback)
  emit('update:current-guess', '')
  emit('update:current-feedback', [])
}

function reset() {
  emit('update:current-guess', '')
  emit('update:current-feedback', [])
  emit('reset')
}

function handleInput(event) {
  const value = event.target.value.toLowerCase().replace(/[^a-z]/g, '')
  emit('update:current-guess', value.slice(0, 5))
  
  if (value.length === 5 && props.currentFeedback.length === 0) {
    emit('update:current-feedback', Array(5).fill(FEEDBACK.ABSENT))
  }
}
</script>

<template>
  <div class="solver-controls">
    <div class="suggestion-section" v-if="!solved">
      <h3>Suggested Next Word:</h3>
      <div class="suggestion-display">
        <span class="suggestion-word">{{ suggestion?.toUpperCase() || '...' }}</span>
        <button @click="useSuggestion" class="btn btn-primary">
          Use Suggestion
        </button>
      </div>
    </div>

    <div class="input-section" v-if="!solved">
      <h3>Enter Your Guess:</h3>
      <input
        :value="currentGuess"
        @input="handleInput"
        type="text"
        maxlength="5"
        placeholder="5-letter word"
        class="guess-input"
      />
      
      <div v-if="currentGuess.length === 5" class="feedback-section">
        <p class="feedback-instructions">Click each letter to cycle through feedback:</p>
        <div class="feedback-tiles">
          <div
            v-for="(letter, index) in currentGuess.split('')"
            :key="index"
            @click="toggleFeedback(index)"
            :class="['feedback-tile', currentFeedback[index] || 'empty']"
          >
            {{ letter.toUpperCase() }}
          </div>
        </div>
        
        <button @click="submitFeedback" class="btn btn-success">
          Submit Feedback
        </button>
      </div>
    </div>

    <div class="possible-words-section">
      <button 
        @click="showPossibleWords = !showPossibleWords" 
        class="btn btn-secondary"
      >
        {{ showPossibleWords ? 'Hide' : 'Show' }} Possible Words ({{ possibleWords.length }})
      </button>
      
      <div v-if="showPossibleWords" class="possible-words-list">
        <div class="words-grid">
          <span v-for="word in possibleWords.slice(0, 100)" :key="word" class="word-item">
            {{ word }}
          </span>
          <span v-if="possibleWords.length > 100" class="more-words">
            ... and {{ possibleWords.length - 100 }} more
          </span>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button v-if="hasGuesses && !solved" @click="emit('edit-last')" class="btn btn-edit">
        Edit Last
      </button>
      <button @click="reset" class="btn btn-reset">
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
.solver-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.suggestion-section,
.input-section,
.possible-words-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1.5rem;
}

h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.suggestion-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.suggestion-word {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  letter-spacing: 0.2rem;
  padding: 0.5rem 1rem;
  background: #f0f4ff;
  border-radius: 8px;
}

.guess-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  border: 2px solid #d3d6da;
  border-radius: 8px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  font-weight: bold;
}

.guess-input:focus {
  outline: none;
  border-color: #667eea;
}

.feedback-section {
  margin-top: 1.5rem;
}

.feedback-instructions {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.feedback-tiles {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feedback-tile {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.feedback-tile:hover {
  transform: scale(1.05);
}

.feedback-tile.correct {
  background: #6aaa64;
  border-color: #6aaa64;
  color: white;
}

.feedback-tile.present {
  background: #c9b458;
  border-color: #c9b458;
  color: white;
}

.feedback-tile.absent {
  background: #787c7e;
  border-color: #787c7e;
  color: white;
}

.feedback-tile.empty {
  background: white;
  color: #000;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-success {
  background: #6aaa64;
  color: white;
  width: 100%;
}

.btn-success:hover {
  background: #5a9454;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  width: 100%;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-edit {
  background: #ffa500;
  color: white;
  flex: 1;
}

.btn-edit:hover {
  background: #ff8c00;
}

.btn-reset {
  background: #ff6b6b;
  color: white;
  flex: 1;
}

.btn-reset:hover {
  background: #ee5a52;
}

.possible-words-list {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.word-item {
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  text-align: center;
  font-family: monospace;
  font-size: 0.9rem;
}

.more-words {
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .feedback-tile {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}
</style>
