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
</script>

<template>
  <div class="app">
    <header>
      <h1>🎯 Wordle Breaker</h1>
      <p class="subtitle">AI-Powered Wordle Solver</p>
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
          <h2>🎉 Solved in {{ attemptCount }} attempts!</h2>
        </div>

        <SolverControls
          :suggestion="nextSuggestion"
          :solved="solved"
          :possibleWords="possibleWords"
          @submit="handleFeedbackSubmit"
          @reset="reset"
          @use-suggestion="useSuggestion"
        />
      </div>

      <div class="instructions">
        <h3>How to Use:</h3>
        <ol>
          <li>Click "Use Suggestion" to get the optimal word to guess</li>
          <li>Enter the word in Wordle and return here</li>
          <li>Click on each letter to set the feedback:
            <ul>
              <li><span class="demo-tile correct">Green</span> = Correct position</li>
              <li><span class="demo-tile present">Yellow</span> = Wrong position</li>
              <li><span class="demo-tile absent">Gray</span> = Not in word</li>
            </ul>
          </li>
          <li>Click "Submit Feedback" to get the next suggestion</li>
          <li>Repeat until solved!</li>
        </ol>
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
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  main {
    grid-template-columns: 1fr;
  }
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin: 2rem 0;
}

.success-message h2 {
  margin: 0;
  font-size: 2rem;
}

.instructions {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.instructions h3 {
  margin-top: 0;
  color: #2c3e50;
}

.instructions ol {
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.instructions ul {
  margin-top: 0.5rem;
  list-style: none;
  padding-left: 0;
}

.demo-tile {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
}

.demo-tile.correct {
  background: #6aaa64;
}

.demo-tile.present {
  background: #c9b458;
}

.demo-tile.absent {
  background: #787c7e;
}
</style>
