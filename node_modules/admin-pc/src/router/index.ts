import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { public: true } },
    { path: '/register', name: 'register', component: () => import('@/pages/RegisterPage.vue'), meta: { public: true } },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue'), meta: { roles: ['merchant', 'admin', 'superAdmin'] } },
        { path: '/hotel/edit', name: 'hotel-edit', component: () => import('@/pages/HotelEditPage.vue'), meta: { roles: ['merchant', 'superAdmin'] } },
        { path: '/audit', name: 'audit', component: () => import('@/pages/AuditListPage.vue'), meta: { roles: ['admin', 'superAdmin'] } },
        { path: '/system/users', name: 'system-users', component: () => import('@/pages/SystemUsersPage.vue'), meta: { roles: ['superAdmin'] } },
        { path: '/system/roles', name: 'system-roles', component: () => import('@/pages/SystemRolesPage.vue'), meta: { roles: ['superAdmin'] } },
        { path: '/system/menus', name: 'system-menus', component: () => import('@/pages/SystemMenusPage.vue'), meta: { roles: ['superAdmin'] } },
        { path: '/system/logs', name: 'system-logs', component: () => import('@/pages/SystemLogsPage.vue'), meta: { roles: ['superAdmin'] } }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.public) return true;
  if (!authStore.token) return '/login';
  const roles = to.meta.roles as string[] | undefined;
  if (roles && !roles.includes(authStore.role)) return '/dashboard';
  return true;
});

export default router;
