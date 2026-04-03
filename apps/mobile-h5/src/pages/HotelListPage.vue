<template>
  <main class="mobile-page px-4 pb-8 pt-0">
    <section class="sticky top-0 z-20 bg-#f7fbff/92 px-0 pt-2 backdrop-blur">
      <div class="rounded-5 bg-white/96 p-3 shadow-card">
        <div class="flex items-center gap-3">
          <button
            class="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-700"
            @click="router.back()"
            aria-label="返回"
          >
            <svg viewBox="0 0 24 24" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div class="min-w-0 flex-1 rounded-4 bg-slate-50 px-3 py-2.5 text-left">
            <div class="flex items-center gap-2 text-sm font-700 text-slate-900">
              <button class="font-700 text-slate-900" @click="goCitySelect">{{ query.city }}</button>
              <span class="text-slate-300">|</span>
              <button class="font-700 text-slate-900" @click="showDateDialog = true">{{ monthDayText }}</button>
              <span class="text-xs font-600 text-brand-500">{{ nights }}晚</span>
            </div>
            <div class="mt-2 flex w-full items-center gap-2 rounded-3 bg-white px-3 py-2 text-xs text-slate-400 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)]">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                v-model="query.keyword"
                class="w-full bg-transparent text-xs text-slate-500 outline-none"
                placeholder="位置/品牌/酒店"
                @keydown.enter="applyKeyword"
                @blur="applyKeyword"
              />
            </div>
          </div>
          <button
            class="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-500"
            @click="openMapTip"
            aria-label="地图"
          >
            <svg viewBox="0 0 24 24" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9.5 4.5L4.5 6.5v13l5-2 5 2 5-2v-13l-5 2-5-2z" />
              <path d="M9.5 4.5v13" />
              <path d="M14.5 6.5v13" />
            </svg>
          </button>
        </div>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="sort in sortOptions"
          :key="sort.value"
          class="shrink-0 rounded-full px-3 py-1.5 text-xs"
          :class="activeQuickKey === sort.value ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-600'"
          @click="changeSort(sort.value)"
        >
          {{ sort.label }}
        </button>
        </div>
        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            class="shrink-0 rounded-full border px-3 py-1.5 text-xs"
            :class="activeQuickKey === 'breakfast' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 text-slate-600'"
            @click="activateQuickFilter('breakfast')"
          >
            含早餐
          </button>
          <button
            class="shrink-0 rounded-full border px-3 py-1.5 text-xs"
            :class="activeQuickKey === 'freeCancel' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 text-slate-600'"
            @click="activateQuickFilter('freeCancel')"
          >
            可取消
          </button>
          <button
            class="shrink-0 rounded-full border px-3 py-1.5 text-xs"
            :class="activeQuickKey === 'nearMetro' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 text-slate-600'"
            @click="activateQuickFilter('nearMetro')"
          >
            近地铁
          </button>
          <button
            class="shrink-0 rounded-full border px-3 py-1.5 text-xs"
            :class="activeQuickKey === 'highStar' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 text-slate-600'"
            @click="activateQuickFilter('highStar')"
          >
            高星优先
          </button>
        </div>
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

    <DateRangeModal
      :visible="showDateDialog"
      :model-value="{ checkIn: query.checkIn, checkOut: query.checkOut }"
      @close="showDateDialog = false"
      @confirm="applyDates"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HOTEL_SORT_OPTIONS } from '@shared/constants';
import { calcNights, normalizeDateRange } from '@shared/utils';
import type { SearchQuery, SortType } from '@shared/types';
import DateRangeModal from '@/components/DateRangeModal.vue';
import HotelCard from '@/components/HotelCard.vue';
import SkeletonHotelCard from '@/components/SkeletonHotelCard.vue';
import { useInfiniteHotels } from '@/composables/useInfiniteHotels';

const route = useRoute();
const router = useRouter();
const showDateDialog = ref(false);
type QuickKey = SortType | 'breakfast' | 'freeCancel' | 'nearMetro' | 'highStar';
const activeQuickKey = ref<QuickKey>('recommended');

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
const monthDayText = computed(() => {
  if (!query.checkIn || !query.checkOut) return '请选择日期';
  return `${query.checkIn.slice(5)} - ${query.checkOut.slice(5)}`;
});
const sortOptions = HOTEL_SORT_OPTIONS;
const { hotels, loading, error, finished, load } = useInfiniteHotels(() => ({ ...query }));

const resolveActiveQuickKey = () => {
  if (query.breakfast) return 'breakfast';
  if (query.freeCancel) return 'freeCancel';
  if (query.nearMetro) return 'nearMetro';
  if (query.starList?.[0] === 5) return 'highStar';
  return (query.sortBy as SortType) || 'recommended';
};

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
    activeQuickKey.value = resolveActiveQuickKey();
    Object.assign(query, normalizeDateRange(query.checkIn, query.checkOut));
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

const resetExclusiveFilters = () => {
  query.breakfast = false;
  query.freeCancel = false;
  query.nearMetro = false;
  query.starList = undefined;
};

const changeSort = (sortBy: SortType) => {
  activeQuickKey.value = sortBy;
  resetExclusiveFilters();
  query.sortBy = sortBy;
  updateQuery();
};

const activateQuickFilter = (key: 'breakfast' | 'freeCancel' | 'nearMetro' | 'highStar') => {
  activeQuickKey.value = key;
  resetExclusiveFilters();
  query.sortBy = 'recommended';
  if (key === 'highStar') query.starList = [5];
  else query[key] = true;
  updateQuery();
};

const applyDates = (value: { checkIn: string; checkOut: string }) => {
  const normalized = normalizeDateRange(value.checkIn, value.checkOut);
  query.checkIn = normalized.checkIn;
  query.checkOut = normalized.checkOut;
  showDateDialog.value = false;
  updateQuery();
};

const applyKeyword = () => {
  updateQuery();
};

const goCitySelect = () => {
  router.push({ name: 'city-select' });
};

const openMapTip = () => {
  window.alert('地图找酒店功能可作为下一步扩展，目前可先通过城市、日期和关键词筛选。');
};
</script>
