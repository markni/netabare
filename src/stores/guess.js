import { defineStore } from 'pinia';
import { fetchGuess, submitGuess } from '@/utils/api.js';

export const useGuessStore = defineStore('guess', {
  state: () => ({
    questions: [],
    currentKey: null,
    score: null,
    error: null,
    answers: []
  }),

  actions: {
    async fetchQuestions() {
      try {
        this.clearGuess();
        const response = await fetchGuess();
        this.questions = response.data.questions;
        this.currentKey = response.data.key;
      } catch (error) {
        this.error = 'Failed to fetch questions';
        console.error('Failed to fetch questions:', error);
      }
    },

    setAnswer(questionIndex, answerIndex) {
      if (questionIndex >= 0 && questionIndex < this.questions.length) {
        this.answers[questionIndex] = answerIndex;
      }
    },

    async submitAnswer() {
      try {
        const response = await submitGuess(this.currentKey, this.answers);
        this.score = response.data.score;
        console.log('Score value:', this.score);
        return { score: this.score };
      } catch (error) {
        this.error = 'Failed to submit answer';
        console.error('Failed to submit answer:', error);
        return { score: null };
      }
    },

    clearGuess() {
      this.questions = [];
      this.currentKey = null;
      this.score = null;
      this.error = null;
      this.answers = [];
    }
  }
});
