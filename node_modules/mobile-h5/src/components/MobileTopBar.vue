<template>
  <header class="sticky top-0 z-30 border-b border-slate-100 bg-white/94 px-4 py-3 backdrop-blur">
    <div class="flex items-center justify-between">
      <button class="flex items-center gap-1 text-sm text-slate-700" @click="router.back()">
        <span class="i-carbon-chevron-left"></span>
        返回
      </button>
      <div class="text-sm font-700 text-slate-900">{{ title }}</div>
      <button
        v-if="actionText"
        class="rounded-full bg-brand-50 px-3 py-1.5 text-xs text-brand-500"
        @click="$emit('action')"
      >
        {{ actionText }}
      </button>
      <div v-else class="w-12"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{
  title: string;
  actionText?: string;
}>();

defineEmits<{
  action: [];
}>();

const router = useRouter();
</script>
