<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-16 p-5">
    <!-- Error Alert -->
    <div v-if="guessStore.error" class="bg-red-100 mb-5 rounded-lg p-3">
      {{ guessStore.error }}
    </div>

    <div class="flex justify-between">
      <h1 class="text-4xl">评分图识别技术初级考试</h1>
      <div class="relative w-64 border-b border-b-paper-dark dark:border-paper">
        <div
          v-if="guessStore.score !== null"
          class="absolute bottom-[-30px] left-16 z-30 text-8xl text-red"
          style="transform: rotate(-5deg)"
        >
          {{ JSON.stringify(guessStore.score * 10) }}
        </div>
      </div>
    </div>

    <!-- Score Display -->
    <!--    <button @click="startNewGame" class="hover:border-blu rounded-lg border-blue px-6 py-3">-->
    <!--      再来一卷-->
    <!--    </button>-->

    <!-- Questions Section -->
    <div class="grid grid-cols-2 gap-14 gap-y-16">
      <div
        v-for="(question, qIndex) in guessStore.questions"
        :key="qIndex"
        class="flex flex-col gap-2"
      >
        <div>图形 {{ qIndex + 1 }}</div>
        <div
          v-for="(answer, aIndex) in question.answers"
          :key="aIndex"
          @click="selectAnswer(qIndex, aIndex)"
          :class="[
            'cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 hover:border-blue',
            guessStore.answers[qIndex] === aIndex
              ? 'border-blue'
              : 'border-gray-200 hover:bg-gray-50'
          ]"
        >
          {{ String.fromCharCode(65 + aIndex) }}. {{ answer }}
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      @click="submitAnswers"
      :disabled="!isComplete"
      :class="[
        'w-full rounded-lg py-3.5 transition-colors',
        isComplete
          ? 'cursor-pointer bg-blue text-white hover:bg-blue'
          : 'cursor-not-allowed bg-gray-400 text-white'
      ]"
    >
      交卷
    </button>
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// const startNewGame = async () => {
//   await guessStore.fetchQuestions();
// };

// Fetch questions when component mounts
onMounted(async () => {
  await guessStore.fetchQuestions();
});
</script>
