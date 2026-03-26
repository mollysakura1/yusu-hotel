import { onMounted, onUnmounted, ref } from 'vue';
import type { Hotel, SearchQuery } from '@shared/types';
import { fetchHotels } from '@/api/hotel';

export const useInfiniteHotels = (baseQuery: () => SearchQuery) => {
  const hotels = ref<Hotel[]>([]);
  const page = ref(1);
  const loading = ref(false);
  const finished = ref(false);
  const error = ref('');

  const load = async (reset = false) => {
    if (loading.value || (!reset && finished.value)) return;
    if (reset) {
      hotels.value = [];
      page.value = 1;
      finished.value = false;
    }
    loading.value = true;
    error.value = '';
    try {
      const result = await fetchHotels({ ...baseQuery(), page: page.value, pageSize: 10 });
      hotels.value = reset ? result.list : [...hotels.value, ...result.list];
      finished.value = !result.hasMore;
      page.value += 1;
    } catch (err: any) {
      error.value = err?.message || '酒店加载失败';
    } finally {
      loading.value = false;
    }
  };

  const onScroll = () => {
    const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    if (remaining < 160) load();
  };

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
  onUnmounted(() => window.removeEventListener('scroll', onScroll));

  return { hotels, loading, finished, error, load };
};
