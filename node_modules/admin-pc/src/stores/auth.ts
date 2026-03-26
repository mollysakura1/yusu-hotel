import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { User, UserRole } from '@shared/types';
import { ADMIN_ROLE_MENU } from '@shared/constants';
import { loginApi, registerApi } from '@/api/auth';

type SafeUser = Omit<User, 'password'>;

export const useAuthStore = defineStore('admin-auth', () => {
  const token = ref(localStorage.getItem('easy-stay:token') || '');
  const user = ref<SafeUser | null>(
    localStorage.getItem('easy-stay:user')
      ? JSON.parse(localStorage.getItem('easy-stay:user') as string)
      : null
  );

  const role = computed<UserRole | ''>(() => user.value?.role || '');
  const menus = computed(() => (role.value ? ADMIN_ROLE_MENU[role.value] : []));

  const persist = (data: { token: string; user: SafeUser }) => {
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('easy-stay:token', data.token);
    localStorage.setItem('easy-stay:user', JSON.stringify(data.user));
  };

  const login = async (payload: { username: string; password: string }) => persist(await loginApi(payload));
  const register = async (payload: {
    username: string;
    password: string;
    nickname: string;
    role: UserRole;
  }) => persist(await registerApi(payload));

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('easy-stay:token');
    localStorage.removeItem('easy-stay:user');
  };

  return { token, user, role, menus, login, register, logout };
});
