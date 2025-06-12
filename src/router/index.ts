import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import ErrorView from '@/pages/ErrorView.vue';
import HomeView from '@/pages/home/HomeView.vue';
import BubbleSortView from '@/pages/bubble/BubbleSortView.vue';
import SelectionSortView from '@/pages/selection/SelectionSortView.vue';
import InsertionSortView from '@/pages/Insertion/InsertionSortView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    // meta: { requiresAuth: true },
    children: [
      { path: '', component: HomeView },
      { path: 'bubble-sort', component: BubbleSortView },
      { path: 'selection-sort', component: SelectionSortView },
      { path: 'insertion-sort', component: InsertionSortView },
    ],
  },
  { path: '/:catchAll(.*)*', component: ErrorView }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
