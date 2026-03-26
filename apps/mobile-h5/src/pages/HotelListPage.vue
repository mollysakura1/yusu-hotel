<template>
  <main class="mobile-page px-4 pb-8 pt-3">
    <section class="sticky top-0 z-10 rounded-5 bg-white/95 p-3 shadow-card backdrop-blur">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs text-slate-400">{{ query.city }} · {{ nights }}晚</div>
          <div class="mt-1 text-sm font-700 text-slate-900">{{ query.checkIn }} - {{ query.checkOut }}</div>
        </div>
        <button class="rounded-full bg-brand-50 px-3 py-1.5 text-xs text-brand-500" @click="goHome">修改搜索</button>
      </div>
      <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="sort in sortOptions"
          :key="sort.value"
          class="shrink-0 rounded-full px-3 py-1.5 text-xs"
          :class="query.sortBy === sort.value ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-600'"
          @click="changeSort(sort.value)"
        >
          {{ sort.label }}
        </button>
      </div>
      <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button class="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600" @click="toggleBoolean('breakfast')">含早餐</button>
        <button class="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600" @click="toggleBoolean('freeCancel')">可取消</button>
        <button class="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600" @click="toggleBoolean('nearMetro')">近地铁</button>
        <button class="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600" @click="filterHighStar">高星优先</button>
      </div>
    </section>

    <section class="mt-4 space-y-3">
      <template v-if="loading && !hotels.length">
        <SkeletonHotelCard v-for="item in 4" :key="item" />
      </template>
      <div v-else-if="error" class="rounded-5 bg-white p-6 text-center text-sm text-red-500 shadow-card">{{ error }}</div>
      <div v-else-if="!hotels.length" class="rounded-5 bg-white p-6 text-center text-sm text-slate-500 shadow-card">暂无符合条件的酒店，换个筛选试试</div>
      <HotelCard v-for="hotel in hotels" :key="hotel.id" :hotel="hotel" />
      <div v-if="loading && hotels.length" class="space-y-3">
        <SkeletonHotelCard v-for="item in 2" :key="`more-${item}`" />
      </div>
      <div v-if="finished && hotels.length" class="py-4 text-center text-xs text-slate-400">已加载全部酒店</div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HOTEL_SORT_OPTIONS } from '@shared/constants';
import { calcNights } from '@shared/utils';
import type { SearchQuery, SortType } from '@shared/types';
import HotelCard from '@/components/HotelCard.vue';
import SkeletonHotelCard from '@/components/SkeletonHotelCard.vue';
import { useInfiniteHotels } from '@/composables/useInfiniteHotels';

const route = useRoute();
const router = useRouter();

const query = reactive<SearchQuery>({
  city: String(route.query.city || '上海'),
  keyword: String(route.query.keyword || ''),
  checkIn: String(route.query.checkIn || ''),
  checkOut: String(route.query.checkOut || ''),
  tags: route.query.tags ? String(route.query.tags).split(',') : [],
  minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
  starList: route.query.starList ? String(route.query.starList).split(',').map(Number) : undefined,
  sortBy: (route.query.sortBy as SortType) || 'recommended',
  breakfast: route.query.breakfast === 'true',
  freeCancel: route.query.freeCancel === 'true',
  nearMetro: route.query.nearMetro === 'true'
});

const nights = computed(() => calcNights(query.checkIn, query.checkOut));
const sortOptions = HOTEL_SORT_OPTIONS;
const { hotels, loading, error, finished, load } = useInfiniteHotels(() => ({ ...query }));

watch(
  () => route.query,
  () => {
    Object.assign(query, {
      city: String(route.query.city || '上海'),
      keyword: String(route.query.keyword || ''),
      checkIn: String(route.query.checkIn || ''),
      checkOut: String(route.query.checkOut || ''),
      tags: route.query.tags ? String(route.query.tags).split(',') : [],
      minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
      maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
      starList: route.query.starList ? String(route.query.starList).split(',').map(Number) : undefined,
      sortBy: (route.query.sortBy as SortType) || 'recommended',
      breakfast: route.query.breakfast === 'true',
      freeCancel: route.query.freeCancel === 'true',
      nearMetro: route.query.nearMetro === 'true'
    });
    load(true);
  },
  { immediate: true }
);

const updateQuery = () => {
  router.replace({
    query: {
      city: query.city,
      keyword: query.keyword,
      checkIn: query.checkIn,
      checkOut: query.checkOut,
      tags: query.tags?.join(','),
      starList: query.starList?.join(','),
      minPrice: query.minPrice?.toString(),
      maxPrice: query.maxPrice?.toString(),
      breakfast: query.breakfast ? 'true' : undefined,
      freeCancel: query.freeCancel ? 'true' : undefined,
      nearMetro: query.nearMetro ? 'true' : undefined,
      sortBy: query.sortBy
    }
  });
};

const changeSort = (sortBy: SortType) => {
  query.sortBy = sortBy;
  updateQuery();
};

const toggleBoolean = (field: 'breakfast' | 'freeCancel' | 'nearMetro') => {
  query[field] = !query[field];
  updateQuery();
};

const filterHighStar = () => {
  query.starList = query.starList?.[0] === 5 ? undefined : [5];
  updateQuery();
};

const goHome = () => router.push('/');
</script>
