<template>
  <el-container style="min-height: 100vh">
    <el-aside width="236px" style="background: #0f2744">
      <div style="padding: 24px 20px; color: #fff; font-size: 20px; font-weight: 700">易宿后台</div>
      <el-menu
        :default-active="route.path"
        background-color="#0f2744"
        text-color="#d2dbeb"
        active-text-color="#ffffff"
        router
        unique-opened
      >
        <template v-for="item in authStore.menus" :key="item.key">
          <el-sub-menu v-if="item.children?.length" :index="item.key">
            <template #title>{{ item.label }}</template>
            <el-menu-item v-for="child in item.children" :key="child.key" :index="child.path || child.key">
              {{ child.label }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path || item.key">
            {{ item.label }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header
        style="display: flex; align-items: center; justify-content: space-between; background: #fff; box-shadow: 0 4px 16px rgba(10, 28, 62, 0.05)"
      >
        <div style="font-size: 14px; color: #425466">欢迎回来，{{ authStore.user?.nickname }}</div>
        <div style="display: flex; gap: 12px; align-items: center">
          <el-tag type="primary">{{ roleText }}</el-tag>
          <el-button @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const roleText = computed(() => {
  if (authStore.role === 'superAdmin') return '超级管理员';
  if (authStore.role === 'admin') return '管理员';
  return '商家';
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
