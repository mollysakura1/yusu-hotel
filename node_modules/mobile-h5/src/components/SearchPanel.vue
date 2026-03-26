<template>
  <section class="rounded-5 bg-white/96 p-4 shadow-card backdrop-blur">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <div class="text-xs text-slate-400">当前城市</div>
        <button class="mt-1 flex items-center gap-1 text-sm font-700 text-slate-900">
          <span class="i-carbon-location text-brand-500"></span>
          {{ form.city }}
        </button>
      </div>
      <div class="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-500">模拟定位中</div>
    </div>

    <div class="rounded-4 bg-slate-50 px-3 py-3">
      <div class="mb-1 text-xs text-slate-400">关键词</div>
      <input
        v-model="form.keyword"
        class="w-full bg-transparent text-sm text-slate-900 outline-none"
        placeholder="地点 / 品牌 / 酒店名"
      />
    </div>

    <div class="mt-3">
      <DateRangePicker v-model="dateRange" />
    </div>

    <div class="mt-3 rounded-4 bg-slate-50 p-3">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-600 text-slate-900">快捷筛选</span>
        <span class="text-xs text-slate-400">高效决策</span>
      </div>
      <FilterChips v-model="tags" :options="tagOptions" />
    </div>

    <div class="mt-3 grid grid-cols-2 gap-3">
      <label class="rounded-4 bg-slate-50 px-3 py-2 text-sm">
        <span class="mb-1 block text-xs text-slate-400">价格区间</span>
        <select v-model="priceRange" class="w-full bg-transparent outline-none">
          <option value="">不限</option>
          <option value="0-300">300 以下</option>
          <option value="300-600">300-600</option>
          <option value="600-1000">600-1000</option>
          <option value="1000-99999">1000 以上</option>
        </select>
      </label>
      <label class="rounded-4 bg-slate-50 px-3 py-2 text-sm">
        <span class="mb-1 block text-xs text-slate-400">星级</span>
        <select v-model="starValue" class="w-full bg-transparent outline-none">
          <option value="">不限</option>
          <option value="5">五星/豪华</option>
          <option value="4">四星/高档</option>
          <option value="3">三星/舒适</option>
        </select>
      </label>
    </div>

    <button
      class="mt-4 h-12 w-full rounded-full bg-linear-to-r from-#2a95ff to-brand-500 text-base font-700 text-white"
      @click="submit"
    >
      查询酒店
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { HOTEL_TAG_OPTIONS } from '@shared/constants';
import { useSearchStore } from '@/stores/search';
import DateRangePicker from './DateRangePicker.vue';
import FilterChips from './FilterChips.vue';

const router = useRouter();
const searchStore = useSearchStore();
const form = reactive({ ...searchStore.searchForm });

const tags = computed({
  get: () => form.tags || [],
  set: (value: string[]) => {
    form.tags = value;
  }
});

const dateRange = computed({
  get: () => ({ checkIn: form.checkIn, checkOut: form.checkOut }),
  set: (value) => {
    form.checkIn = value.checkIn;
    form.checkOut = value.checkOut;
  }
});

const tagOptions = HOTEL_TAG_OPTIONS;

const priceRange = computed({
  get: () =>
    form.minPrice !== undefined && form.maxPrice !== undefined ? `${form.minPrice}-${form.maxPrice}` : '',
  set: (value: string) => {
    if (!value) {
      form.minPrice = undefined;
      form.maxPrice = undefined;
      return;
    }
    const [minPrice, maxPrice] = value.split('-').map(Number);
    form.minPrice = minPrice;
    form.maxPrice = maxPrice;
  }
});

const starValue = computed({
  get: () => form.starList?.[0]?.toString() || '',
  set: (value: string) => {
    form.starList = value ? [Number(value)] : undefined;
  }
});

const submit = () => {
  searchStore.searchForm = { ...searchStore.searchForm, ...form };
  searchStore.saveKeywordHistory(form.keyword);
  router.push({
    name: 'hotel-list',
    query: {
      city: form.city,
      keyword: form.keyword,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      tags: form.tags?.join(','),
      minPrice: form.minPrice?.toString(),
      maxPrice: form.maxPrice?.toString(),
      starList: form.starList?.join(','),
      breakfast: form.breakfast ? 'true' : undefined,
      freeCancel: form.freeCancel ? 'true' : undefined,
      nearMetro: form.nearMetro ? 'true' : undefined,
      sortBy: form.sortBy
    }
  });
};
</script>
