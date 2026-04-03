import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/mine', name: 'mine', component: () => import('@/pages/MinePage.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/pages/SettingsPage.vue') },
    { path: '/city-select', name: 'city-select', component: () => import('@/pages/CitySelectPage.vue') },
    { path: '/hotels', name: 'hotel-list', component: () => import('@/pages/HotelListPage.vue') },
    { path: '/hotel/:id', name: 'hotel-detail', component: () => import('@/pages/HotelDetailPage.vue') }
  ]
});
