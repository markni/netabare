<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-16 p-5">
    <!-- Error Alert -->
    <div v-if="guessStore.error" class="mb-5 rounded-lg bg-red-100 p-3">
      {{ guessStore.error }}
    </div>

    <div class="flex flex-col justify-between gap-16 sm:flex-row">
      <h1 class="text-2xl sm:text-4xl">{{ texts._scoreChartRecognition }}</h1>
      <div class="border-b-zinc dark:border-paper relative w-64 border-b">
        <div
          v-if="guessStore.score !== null"
          class="text-red absolute bottom-[-30px] left-16 z-30 text-8xl underline underline-offset-8"
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
    <div class="grid grid-cols-1 gap-14 gap-y-16 sm:grid-cols-2">
      <div
        v-for="(question, qIndex) in guessStore.questions"
        :key="qIndex"
        class="flex flex-col gap-2"
      >
        <div class="relative">{{ texts._graph }} {{ qIndex + 1 }}</div>
        <div class="aspect-[6/3]">
          <MiniBarChart :rating-data="guessStore.getRatingChartData(qIndex)" />
        </div>
        <div
          v-for="(answer, aIndex) in question.answers"
          :key="aIndex"
          @click="selectAnswer(qIndex, aIndex)"
          :class="[
            'hover:border-blue relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200',
            guessStore.answers[qIndex] === aIndex ? 'border-blue' : 'border-gray-200'
          ]"
        >
          {{ String.fromCharCode(65 + aIndex) }}. {{ answer }}

          <div
            v-if="guessStore.answers[qIndex] === aIndex && guessStore.score !== null"
            class="text-red absolute z-30 text-8xl"
            :style="{
              transform: `rotate(${-5 + Math.random() * 10 - 5}deg)`,
              top: `${-20 + Math.random() * 10 - 5}px`,
              left: `${10 + Math.random() * 10 - 5}px`
            }"
          >
            {{ guessStore.results[qIndex] ? 'o' : '✔' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      @click="guessStore.score !== null ? guessStore.fetchQuestions() : submitAnswers()"
      :disabled="!isComplete && guessStore.score === null"
      :class="[
        'w-full rounded-lg py-3.5 text-2xl transition-colors',
        isComplete || guessStore.score !== null
          ? 'bg-blue hover:bg-blue cursor-pointer text-white'
          : 'cursor-not-allowed bg-gray-400 text-white'
      ]"
    >
      {{ guessStore.score !== null ? texts._continueChallenge : texts._submitExam }}
    </button>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useGuessStore } from '@/stores/guess';
import MiniBarChart from '@/components/charts/MiniBarChart.vue';
import texts from '@/constants/texts.js';

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
