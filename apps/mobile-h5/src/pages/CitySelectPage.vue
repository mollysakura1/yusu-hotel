<template>
  <main class="mobile-page bg-white min-h-screen">
    <header class="sticky top-0 z-20 border-b border-slate-100 bg-white px-4 py-3">
      <div class="flex items-center gap-3">
        <button class="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100" @click="goBack">
          <span class="i-carbon-chevron-left text-slate-700"></span>
        </button>
        <div class="flex-1 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-400">
          <div class="flex items-center gap-2">
            <span class="i-carbon-search"></span>
            <input
              v-model="keyword"
              placeholder="输入城市名、拼音或首字母查询"
              class="w-full bg-transparent text-slate-700 outline-none"
            />
          </div>
        </div>
      </div>
    </header>

    <section class="px-4 pt-4">
      <div class="text-xs text-slate-400">定位 / 最近访问</div>
      <div class="mt-3 flex flex-wrap gap-3">
        <button
          class="rounded-3 border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-600"
          @click="selectCity(searchStore.searchForm.city)"
        >
          <span class="i-carbon-location-filled mr-1"></span>
          {{ searchStore.searchForm.city }}
        </button>
        <button
          v-for="item in recentCities"
          :key="item"
          class="rounded-3 border border-slate-200 px-3 py-2 text-sm text-slate-600"
          @click="selectCity(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>

    <section class="px-4 pt-5">
      <div class="text-xs text-slate-400">热门城市</div>
      <div class="mt-3 grid grid-cols-4 gap-3">
        <button
          v-for="city in hotCities"
          :key="city"
          class="rounded-3 border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 shadow-sm"
          @click="selectCity(city)"
        >
          {{ city }}
        </button>
      </div>
    </section>

    <section class="relative px-4 pb-6 pt-6">
      <div class="pr-6">
        <div v-for="group in filteredGroups" :key="group.letter" :id="`city-${group.letter}`" class="mb-6">
          <div class="sticky top-14 z-10 bg-white py-2 text-base font-700 text-slate-900">
            {{ group.letter }}
          </div>
          <div class="space-y-1">
            <button
              v-for="city in group.cities"
              :key="city"
              class="block w-full border-b border-slate-100 py-3 text-left text-sm text-slate-700"
              @click="selectCity(city)"
            >
              {{ city }}
            </button>
          </div>
        </div>
      </div>

      <div class="fixed right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-1 py-2 shadow-card">
        <button
          v-for="group in filteredGroups"
          :key="group.letter"
          class="block h-4 w-5 text-[10px] leading-4 text-slate-500"
          @click="scrollToLetter(group.letter)"
        >
          {{ group.letter }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';

const CITY_GROUPS = [
  { letter: 'A', cities: ['阿坝', '阿克苏', '安庆', '鞍山'] },
  { letter: 'B', cities: ['北京', '保定', '包头', '北海'] },
  { letter: 'C', cities: ['重庆', '成都', '长沙', '常州'] },
  { letter: 'D', cities: ['大连', '东莞'] },
  { letter: 'E', cities: ['鄂尔多斯'] },
  { letter: 'F', cities: ['福州', '佛山'] },
  { letter: 'G', cities: ['广州', '桂林', '贵阳'] },
  { letter: 'H', cities: ['杭州', '合肥', '海口', '哈尔滨'] },
  { letter: 'J', cities: ['济南', '嘉兴', '金华'] },
  { letter: 'K', cities: ['昆明'] },
  { letter: 'L', cities: ['兰州', '廊坊', '丽江'] },
  { letter: 'M', cities: ['绵阳'] },
  { letter: 'N', cities: ['南京', '宁波', '南昌', '南宁'] },
  { letter: 'Q', cities: ['青岛', '泉州'] },
  { letter: 'S', cities: ['上海', '深圳', '苏州', '沈阳', '三亚'] },
  { letter: 'T', cities: ['天津', '太原'] },
  { letter: 'W', cities: ['武汉', '无锡', '温州'] },
  { letter: 'X', cities: ['西安', '厦门', '徐州'] },
  { letter: 'Y', cities: ['烟台', '扬州', '银川'] },
  { letter: 'Z', cities: ['郑州', '珠海', '中山'] }
];

const hotCities = ['杭州', '北京', '上海', '广州', '深圳', '成都', '天津', '南京', '苏州', '武汉', '西安'];
const router = useRouter();
const searchStore = useSearchStore();
const keyword = ref('');

const recentCities = computed(() =>
  Array.from(new Set([searchStore.searchForm.city, '重庆', '杭州', '北京'])).slice(0, 4)
);

const filteredGroups = computed(() => {
  const text = keyword.value.trim();
  if (!text) return CITY_GROUPS;
  return CITY_GROUPS.map((group) => ({
    ...group,
    cities: group.cities.filter((city) => city.includes(text))
  })).filter((group) => group.cities.length);
});

const selectCity = (city: string) => {
  searchStore.searchForm = { ...searchStore.searchForm, city };
  router.push({ name: 'home' });
};

const goBack = () => {
  router.back();
};

const scrollToLetter = (letter: string) => {
  document.getElementById(`city-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>
