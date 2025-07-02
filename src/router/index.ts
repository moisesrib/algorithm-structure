import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import BubbleSortView from '@/pages/bubble/BubbleSortView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BubbleSortView,
  },
  { path: '/:catchAll(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
