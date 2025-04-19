import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAppStore } from '@/stores/app';
import texts from '@/constants/texts.js';

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'netaba.re' }
    },
    {
      path: '/user/:id?',
      name: 'user',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UserView.vue'),
      props: true,
      meta: { title: `${texts._user} | netaba.re` }
    },
    {
      path: '/subject/:id',
      name: 'subject',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SubjectView.vue'),
      props: true,
      meta: { title: `${texts._subject} | netaba.re` }
    },
    {
      path: '/trending',
      name: 'trending',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TrendingView.vue'),
      meta: { title: `${texts._trending} | netaba.re` }
    },
    {
      path: '/season/:year?/:month?',
      name: 'season',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SeasonView.vue'),
      meta: { title: `${texts._season} | netaba.re` }
    },
    {
      path: '/:id0/vs/:id1',
      name: 'vs',
      props: true,
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/VsView.vue'),
      meta: { title: `${texts._experimental} | netaba.re` }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: { title: `${texts._history} | netaba.re` },
      children: [
        {
          path: ':yearRange(\\d{4}-\\d{4})?/:scoreRange(\\d+-\\d+)?',
          name: 'history-filtered',
          component: () => import('../views/HistoryView.vue'),
          props: true,
          meta: { title: `${texts._history} | netaba.re` }
        }
      ]
    },
    {
      path: '/quiz',
      name: 'quiz',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GuessView.vue'),
      meta: { title: `${texts._quiz} | netaba.re` }
    },
    {
      path: '/ui',
      name: 'ui',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UIView.vue'),
      meta: { title: 'UI | netaba.re' }
    },
    {
      path: '/:catchAll(.*)*', // This regex will match any path
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '404 | netaba.re' }
    }
  ]
});

// Global navigation guard to clear error states and update title
router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  // Clear all error states before navigation
  appStore.setNetworkError(false);
  appStore.setNotFoundUserError(false);
  appStore.setNotFoundSubjectError(false);
  appStore.setLongPolling(false);

  // Update document title
  document.title = to.meta.title || 'netaba.re';

  next();
});

export default router;
