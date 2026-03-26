import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Hotel } from '@shared/types';
import { generateHistoryKey } from '@shared/utils';

const RECENT_KEY = generateHistoryKey('recent-browse');
const FAVORITE_KEY = generateHistoryKey('favorites');

export const useBrowseStore = defineStore('mobile-browse', () => {
  const recentHotels = ref<Hotel[]>(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
  const favorites = ref<string[]>(JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]'));

  const addRecent = (hotel: Hotel) => {
    recentHotels.value = [hotel, ...recentHotels.value.filter((item) => item.id !== hotel.id)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentHotels.value));
  };

  const toggleFavorite = (hotelId: string) => {
    favorites.value = favorites.value.includes(hotelId)
      ? favorites.value.filter((id) => id !== hotelId)
      : [...favorites.value, hotelId];
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites.value));
  };

  return { recentHotels, favorites, addRecent, toggleFavorite };
});
