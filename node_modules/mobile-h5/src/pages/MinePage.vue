<template>
  <main class="mobile-page pb-26">
    <section
      class="relative overflow-hidden px-4 pb-8 pt-5 text-white"
      style="background: linear-gradient(180deg, #0f62da 0%, #5ea9ff 100%)"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <img :src="uiStore.userProfile.avatar" alt="avatar" class="h-16 w-16 rounded-full border-3 border-white/75 bg-white object-cover" />
          <div>
            <div class="text-lg font-800">{{ uiStore.userProfile.username }}</div>
            <div class="mt-1 text-sm text-white/80">欢迎回来，查看收藏、浏览记录和设置</div>
          </div>
        </div>
        <button class="rounded-full bg-white/16 px-3 py-2 text-xs text-white" @click="goSettings">
          <span class="i-carbon-settings mr-1"></span>
          设置
        </button>
      </div>
    </section>

    <section class="-mt-4 px-4">
      <div class="rounded-6 bg-white p-4 shadow-card">
        <div class="grid grid-cols-4 gap-3 text-center">
          <div>
            <div class="text-lg font-800 text-slate-900">{{ favoriteCount }}</div>
            <div class="mt-1 text-xs text-slate-500">收藏</div>
          </div>
          <div>
            <div class="text-lg font-800 text-slate-900">{{ recentCount }}</div>
            <div class="mt-1 text-xs text-slate-500">浏览历史</div>
          </div>
          <div>
            <div class="text-lg font-800 text-slate-900">0</div>
            <div class="mt-1 text-xs text-slate-500">积分</div>
          </div>
          <div>
            <div class="text-lg font-800 text-slate-900">0</div>
            <div class="mt-1 text-xs text-slate-500">优惠券</div>
          </div>
        </div>
      </div>

      <div class="mt-4 rounded-6 bg-white p-4 shadow-card">
        <div class="mb-3 text-base font-700 text-slate-900">常用功能</div>
        <div class="grid grid-cols-4 gap-y-4 text-center">
          <button v-for="item in quickActions" :key="item.label" class="flex flex-col items-center gap-2" @click="item.onClick">
            <div class="h-10 w-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <span :class="[item.icon, 'text-lg']"></span>
            </div>
            <span class="text-xs text-slate-600">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div class="mt-4 rounded-6 bg-white p-4 shadow-card">
        <div class="mb-3 text-base font-700 text-slate-900">最近浏览</div>
        <div v-if="browseStore.recentHotels.length" class="space-y-3">
          <button
            v-for="hotel in browseStore.recentHotels.slice(0, 3)"
            :key="hotel.id"
            class="flex w-full items-center gap-3 text-left"
            @click="router.push({ name: 'hotel-detail', params: { id: hotel.id } })"
          >
            <img :src="hotel.coverImage" class="h-14 w-14 rounded-4 object-cover" />
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm font-700 text-slate-900">{{ hotel.nameCn }}</div>
              <div class="mt-1 text-xs text-slate-500">{{ hotel.city }} · {{ hotel.businessArea }} · ¥{{ hotel.priceStart }}起</div>
            </div>
          </button>
        </div>
        <div v-else class="text-sm text-slate-400">暂无浏览记录</div>
      </div>
    </section>
  </main>
  <MobileBottomNav />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MobileBottomNav from '@/components/MobileBottomNav.vue';
import { useBrowseStore } from '@/stores/browse';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const browseStore = useBrowseStore();
const uiStore = useUiStore();

const favoriteCount = computed(() => browseStore.favorites.length);
const recentCount = computed(() => browseStore.recentHotels.length);

const goSettings = () => router.push({ name: 'settings' });

const quickActions = [
  { label: '收藏酒店', icon: 'i-carbon-favorite', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { label: '浏览历史', icon: 'i-carbon-time', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
  { label: '城市切换', icon: 'i-carbon-location', onClick: () => router.push({ name: 'city-select' }) },
  { label: '设置', icon: 'i-carbon-settings', onClick: goSettings }
];
</script>
