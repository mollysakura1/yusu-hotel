<template>
  <main class="mobile-page px-4 pb-8 pt-4">
    <section
      class="relative overflow-hidden rounded-6 px-4 pb-28 pt-5 text-white shadow-card"
      style="background: linear-gradient(135deg, #0b4db3 0%, #1569e8 52%, #3598ff 100%)"
    >
      <div class="text-sm font-500 text-white/78">易宿酒店预订平台</div>
      <h1 class="mt-2 text-2xl font-800 leading-tight text-white [text-shadow:0_2px_8px_rgba(8,36,92,0.22)]">
        高效订酒店，价格更透明
      </h1>
      <p class="mt-2 max-w-72 text-sm leading-6 text-white/90">
        蓝白清爽视觉、紧凑信息编排，围绕出行决策优化搜索和筛选体验。
      </p>
      <div class="absolute -right-5 top-4 h-28 w-28 rounded-full bg-white/8 blur-2xl"></div>
      <div class="absolute -left-6 bottom-3 h-20 w-20 rounded-full bg-#8dc4ff/14 blur-2xl"></div>
    </section>

    <div class="-mt-20">
      <SearchPanel />
    </div>

    <section class="mt-5">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-base font-700 text-slate-900">今日精选 Banner</h2>
        <span class="text-xs text-brand-500">灵感推荐</span>
      </div>
      <div class="flex gap-3 overflow-x-auto pb-2">
        <button
          v-for="banner in banners"
          :key="banner.id"
          class="relative h-36 w-72 shrink-0 overflow-hidden rounded-5 text-left shadow-card"
          @click="goDetail(banner.hotelId)"
        >
          <img :src="banner.image" class="h-full w-full object-cover" />
          <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent p-3 text-white">
            <div class="text-sm font-700">{{ banner.title }}</div>
            <div class="mt-1 text-xs text-white/80">{{ banner.subtitle }}</div>
          </div>
        </button>
      </div>
    </section>

    <section v-if="searchStore.searchHistory.length" class="mt-5 rounded-5 bg-white p-4 shadow-card">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-base font-700 text-slate-900">搜索历史</h2>
        <span class="text-xs text-slate-400">最近 8 条</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in searchStore.searchHistory"
          :key="item"
          class="rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
          @click="quickSearch(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>

    <section v-if="browseStore.recentHotels.length" class="mt-5 rounded-5 bg-white p-4 shadow-card">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-base font-700 text-slate-900">最近浏览</h2>
        <span class="text-xs text-slate-400">快速回看</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="hotel in browseStore.recentHotels"
          :key="hotel.id"
          class="flex items-center gap-3"
          @click="goDetail(hotel.id)"
        >
          <img :src="hotel.coverImage" class="h-16 w-16 rounded-4 object-cover" />
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-600 text-slate-900">{{ hotel.nameCn }}</div>
            <div class="text-xs text-slate-500">{{ hotel.businessArea }} · ¥{{ hotel.priceStart }} 起</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchBanners, type BannerItem } from '@/api/hotel';
import SearchPanel from '@/components/SearchPanel.vue';
import { useSearchStore } from '@/stores/search';
import { useBrowseStore } from '@/stores/browse';

const router = useRouter();
const searchStore = useSearchStore();
const browseStore = useBrowseStore();
const banners = ref<BannerItem[]>([]);

onMounted(async () => {
  banners.value = await fetchBanners();
});

const goDetail = (hotelId: string) => {
  router.push({ name: 'hotel-detail', params: { id: hotelId } });
};

const quickSearch = (keyword: string) => {
  router.push({
    name: 'hotel-list',
    query: {
      city: searchStore.searchForm.city,
      keyword,
      checkIn: searchStore.searchForm.checkIn,
      checkOut: searchStore.searchForm.checkOut,
      tags: searchStore.searchForm.tags?.join(','),
      minPrice: searchStore.searchForm.minPrice?.toString(),
      maxPrice: searchStore.searchForm.maxPrice?.toString(),
      starList: searchStore.searchForm.starList?.join(','),
      breakfast: searchStore.searchForm.breakfast ? 'true' : undefined,
      freeCancel: searchStore.searchForm.freeCancel ? 'true' : undefined,
      nearMetro: searchStore.searchForm.nearMetro ? 'true' : undefined,
      sortBy: searchStore.searchForm.sortBy
    }
  });
};
</script>
