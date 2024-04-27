import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user/:id?',
      name: 'user',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UserView.vue'),
      props: true
    },
    {
      path: '/subject/:id',
      name: 'subject',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SubjectView.vue'),
      props: true
    },
    {
      path: '/trending',
      name: 'trending',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TrendingView.vue')
    },
    {
      path: '/season',
      name: 'season',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SeasonView.vue')
    },
    {
      path: '/:id0/vs/:id1',
      name: 'vs',
      props: true,
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/VsView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      props: true
    },
    {
      path: '/:catchAll(.*)*', // This regex will match any path
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
