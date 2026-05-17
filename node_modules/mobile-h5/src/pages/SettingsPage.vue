<template>
  <main class="mobile-page min-h-screen">
    <MobileTopBar title="设置" />
    <section class="px-4 pt-4 md:px-6 lg:px-8">
      <div class="rounded-6 bg-white p-4 shadow-card">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div class="text-sm font-700 text-slate-900">深色模式</div>
            <div class="mt-1 text-xs text-slate-400">切换 H5 页面明暗主题</div>
          </div>
          <button
            class="relative h-8 w-14 rounded-full transition"
            :class="uiStore.isDarkMode ? 'bg-brand-500' : 'bg-slate-200'"
            @click="uiStore.toggleDarkMode()"
          >
            <span
              class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition"
              :class="uiStore.isDarkMode ? 'left-7' : 'left-1'"
            ></span>
          </button>
        </div>

        <div class="pt-4">
          <div class="text-sm font-700 text-slate-900">当前账号</div>
          <div class="mt-3 flex items-center gap-3">
            <img :src="uiStore.userProfile.avatar" class="h-12 w-12 rounded-full border border-slate-100 object-cover" />
            <div>
              <div class="text-sm font-700 text-slate-900">{{ uiStore.userProfile.username }}</div>
              <div class="text-xs text-slate-400">本地演示账号</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import MobileTopBar from '@/components/MobileTopBar.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>
