<template>
  <nav class="fixed bottom-0 left-0 right-0 z-30">
    <div class="mx-auto flex max-w-[430px] items-center justify-around border-t border-slate-100 bg-white/96 px-4 py-2 safe-bottom backdrop-blur">
      <button
        v-for="item in items"
        :key="item.name"
        class="flex flex-col items-center gap-1 rounded-4 px-5 py-2 text-xs transition"
        :class="route.name === item.name ? 'text-brand-500' : 'text-slate-400'"
        @click="router.push({ name: item.name })"
      >
        <span :class="[item.icon, 'text-lg']"></span>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const items = [
  { name: 'home', label: '首页', icon: 'i-carbon-home' },
  { name: 'mine', label: '我的', icon: 'i-carbon-user-avatar' }
];
</script>
