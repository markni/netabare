<template>
  <div class="guess-container">
    <!-- Error Alert -->
    <div v-if="guessStore.error" class="error-alert">
      {{ guessStore.error }}
    </div>

    <!-- Score Display -->
    <div v-if="guessStore.score !== null" class="score-section">
      <h2>Your Score: {{ JSON.stringify(guessStore.score) }}</h2>
      <button @click="startNewGame" class="primary-button">Start New Game</button>
    </div>

    <!-- Questions Section -->
    <div v-else class="questions-section">
      <div v-for="(question, qIndex) in guessStore.questions" :key="qIndex" class="question-card">
        <h3>Question {{ qIndex + 1 }}</h3>
        <p>{{ question.text }}</p>

        <div class="options-grid">
          <button
            v-for="(answer, aIndex) in question.answers"
            :key="aIndex"
            @click="selectAnswer(qIndex, aIndex)"
            :class="{
              'option-button': true,
              selected: guessStore.answers[qIndex] === aIndex
            }"
          >
            {{ String.fromCharCode(65 + aIndex) }}. {{ answer }}
          </button>
        </div>
      </div>

      {{ guessStore.answers }}
      <!-- Submit Button -->
      <button @click="submitAnswers" :disabled="!isComplete" class="submit-button">
        Submit Answers
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useGuessStore } from '@/stores/guess';

const guessStore = useGuessStore();

// Computed property to check if all questions are answered
const isComplete = computed(() => {
  return (
    guessStore.questions.length > 0 &&
    guessStore.answers.length === guessStore.questions.length &&
    !guessStore.answers.includes(undefined)
  );
});

// Methods
const selectAnswer = (questionIndex, answerIndex) => {
  guessStore.setAnswer(questionIndex, answerIndex);
};

const submitAnswers = async () => {
  await guessStore.submitAnswer();
};

const startNewGame = async () => {
  await guessStore.fetchQuestions();
};

// Fetch questions when component mounts
onMounted(async () => {
  await guessStore.fetchQuestions();
});
</script>

<style scoped>
.guess-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.error-alert {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.question-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.option-button {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover {
  background-color: #f3f4f6;
}

.option-button.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.score-section {
  text-align: center;
  padding: 40px;
}

.primary-button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.primary-button:hover {
  background-color: #2563eb;
}
</style>
