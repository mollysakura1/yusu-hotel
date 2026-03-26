import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AdminMenuNode, PermissionKey, User, UserRole } from '@shared/types';
import { ADMIN_MENU_TREE, ROLE_MENU_ACCESS } from '@shared/constants';
import { fetchCurrentUserProfile, loginApi, registerApi } from '@/api/auth';

type SafeUser = Omit<User, 'password'>;

const filterMenus = (menus: AdminMenuNode[], allowedKeys: string[]): AdminMenuNode[] =>
  menus
    .filter((item) => allowedKeys.includes(item.key))
    .map((item) => ({
      ...item,
      children: item.children ? filterMenus(item.children, allowedKeys) : undefined
    }));

export const useAuthStore = defineStore('admin-auth', () => {
  const token = ref(localStorage.getItem('easy-stay:token') || '');
  const user = ref<SafeUser | null>(
    localStorage.getItem('easy-stay:user')
      ? JSON.parse(localStorage.getItem('easy-stay:user') as string)
      : null
  );

  const role = computed<UserRole | ''>(() => user.value?.role || '');
  const permissionKeys = computed<PermissionKey[]>(() => user.value?.permissionKeys || []);
  const menus = computed(() =>
    role.value ? filterMenus(ADMIN_MENU_TREE, ROLE_MENU_ACCESS[role.value]) : []
  );

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
  const refreshProfile = async () => {
    if (!token.value) return;
    const profile = await fetchCurrentUserProfile();
    user.value = profile;
    localStorage.setItem('easy-stay:user', JSON.stringify(profile));
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('easy-stay:token');
    localStorage.removeItem('easy-stay:user');
  };

  return { token, user, role, permissionKeys, menus, login, register, refreshProfile, logout };
});
