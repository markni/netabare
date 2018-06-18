import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import NotFound from './views/NotFound.vue';
import User from '@/views/User';
import Subject from '@/views/Subject';
import Trending from '@/views/Trending';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: User,
      props: true
    },
    {
      path: '/subject/:id',
      name: 'subject',
      component: Subject,
      props: true
    },
    {
      path: '/trending',
      name: 'trending',
      component: Trending
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
});
