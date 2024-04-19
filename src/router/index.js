import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import HistoryView from '@/views/HistoryView.vue'

const router = createRouter({
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
      path: '/history',
      name: 'history',
      component: HistoryView,
      props: true
    },
    {
      path: '/:catchAll(.*)*', // This regex will match any path
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router
