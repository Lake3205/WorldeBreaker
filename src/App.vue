<script setup>
import { ref, computed } from 'vue'
import WordleBoard from './components/WordleBoard.vue'
import SolverControls from './components/SolverControls.vue'
import { WordleSolver, FEEDBACK } from './solver.js'

const solver = new WordleSolver()
const guesses = ref([])
const currentGuess = ref('')
const currentFeedback = ref([])
const possibleWords = ref([...solver.possibleWords])
const nextSuggestion = ref(solver.getNextGuess())
const solved = ref(false)
const attemptCount = ref(0)

const possibleCount = computed(() => possibleWords.value.length)

function handleFeedbackSubmit(guess, feedback) {
  solver.addGuess(guess, feedback)
  
  guesses.value.push({ word: guess, feedback })
  possibleWords.value = [...solver.possibleWords]
  
  const state = solver.getState()
  nextSuggestion.value = state.nextGuess
  solved.value = state.solved
  attemptCount.value = guesses.value.length
  
  // Clear current input
  currentGuess.value = ''
  currentFeedback.value = []
}

function reset() {
  solver.reset()
  guesses.value = []
  currentGuess.value = ''
  currentFeedback.value = []
  possibleWords.value = [...solver.possibleWords]
  nextSuggestion.value = solver.getNextGuess()
  solved.value = false
  attemptCount.value = 0
}

function useSuggestion() {
  currentGuess.value = nextSuggestion.value
}

function editLast() {
  if (guesses.value.length === 0) return
  
  // Get the last guess before removing it
  const lastGuess = guesses.value[guesses.value.length - 1]
  
  // Remove last guess from array
  guesses.value.pop()
  
  // Reset solver and replay all remaining guesses
  solver.reset()
  for (const guess of guesses.value) {
    solver.addGuess(guess.word, guess.feedback)
  }
  
  // Update state
  possibleWords.value = [...solver.possibleWords]
  const state = solver.getState()
  nextSuggestion.value = state.nextGuess
  solved.value = state.solved
  attemptCount.value = guesses.value.length
  
  // Load the removed guess back into the form for editing
  currentGuess.value = lastGuess.word
  currentFeedback.value = [...lastGuess.feedback]
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Wordle Breaker</h1>
      <p class="subtitle">Wordle Solver</p>
    </header>

    <main>
      <div class="game-container">
        <WordleBoard :guesses="guesses" />
        
        <div class="status-bar" v-if="!solved">
          <div class="stat">
            <span class="label">Possible Words:</span>
            <span class="value">{{ possibleCount }}</span>
          </div>
          <div class="stat">
            <span class="label">Attempts:</span>
            <span class="value">{{ attemptCount }}</span>
          </div>
        </div>

        <div class="success-message" v-if="solved">
          <h2>Solved in {{ attemptCount }} attempts!</h2>
        </div>

        <SolverControls
          :suggestion="nextSuggestion"
          :solved="solved"
          :possibleWords="possibleWords"
          :hasGuesses="guesses.length > 0"
          :currentGuess="currentGuess"
          :currentFeedback="currentFeedback"
          @submit="handleFeedbackSubmit"
          @reset="reset"
          @use-suggestion="useSuggestion"
          @edit-last="editLast"
          @update:current-guess="val => currentGuess = val"
          @update:current-feedback="val => currentFeedback = val"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 3rem;
  margin: 0;
  color: #2c3e50;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  color: #7c8a96;
  margin-top: 0.5rem;
}

main {
  max-width: 600px;
  margin: 0 auto;
}

.game-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.status-bar {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat .value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.success-message {
  text-align: center;
  padding: 2rem;
  background: #6aaa64;
  color: white;
  border-radius: 12px;
  margin: 2rem 0;
}

.success-message h2 {
  margin: 0;
  font-size: 2rem;
}
</style>
