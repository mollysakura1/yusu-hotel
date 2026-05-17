import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import type { SearchQuery } from '@shared/types';
import { calcNights, generateHistoryKey } from '@shared/utils';

const SEARCH_HISTORY_KEY = generateHistoryKey('search-history');

export const useSearchStore = defineStore('mobile-search', () => {
  const searchForm = ref<SearchQuery>({
    city: '上海',
    keyword: '',
    checkIn: dayjs().format('YYYY-MM-DD'),
    checkOut: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    roomCount: 1,
    adultCount: 1,
    childCount: 0,
    tags: [],
    sortBy: 'recommended',
    page: 1,
    pageSize: 10
  });

  const searchHistory = ref<string[]>(JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]'));
  const nights = computed(() => calcNights(searchForm.value.checkIn, searchForm.value.checkOut));

  const saveKeywordHistory = (keyword: string) => {
    if (!keyword) return;
    searchHistory.value = [keyword, ...searchHistory.value.filter((item) => item !== keyword)].slice(0, 8);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value));
  };

  return { searchForm, searchHistory, nights, saveKeywordHistory };
});
