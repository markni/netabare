import { defineStore } from 'pinia';
import { fetchGuess, submitGuess } from '@/utils/api.js';

export const useGuessStore = defineStore('guess', {
  state: () => ({
    questions: [],
    currentKey: null,
    score: null,
    error: null,
    answers: [],
    results: []
  }),

  getters: {
    getRatingChartData: (state) => (index) => {
      if (!state.questions[index]?.rating) return [];

      const count = state.questions[index].rating.count;
      return Object.entries(count).map(([rating, percentage]) => ({
        name: rating,
        y: percentage
      }));
    }
  },

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
        this.results = response.data.results;
        console.log('Score value:', this.score);
        return { score: this.score, results: this.results };
      } catch (error) {
        this.error = 'Failed to submit answer';
        console.error('Failed to submit answer:', error);
        return { score: null, results: [] };
      }
    },

    clearGuess() {
      this.questions = [];
      this.currentKey = null;
      this.score = null;
      this.error = null;
      this.answers = [];
      this.results = [];
    }
  }
});
