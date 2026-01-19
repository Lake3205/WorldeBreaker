<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
})

function getTileClass(feedback) {
  return feedback || 'empty'
}
</script>

<template>
  <div class="wordle-board">
    <div v-for="(guess, index) in guesses" :key="index" class="guess-row">
      <div
        v-for="(letter, letterIndex) in guess.word.split('')"
        :key="letterIndex"
        :class="['tile', getTileClass(guess.feedback[letterIndex])]"
      >
        {{ letter.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.wordle-board {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.guess-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.tile {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.tile.correct {
  background: #6aaa64;
  border-color: #6aaa64;
  color: white;
}

.tile.present {
  background: #c9b458;
  border-color: #c9b458;
  color: white;
}

.tile.absent {
  background: #787c7e;
  border-color: #787c7e;
  color: white;
}

.tile.empty {
  background: white;
  color: #000;
}

@media (max-width: 768px) {
  .tile {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}
</style>
