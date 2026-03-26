<template>
  <main class="mobile-page pb-22">
    <header class="sticky top-0 z-20 flex items-center justify-between bg-white/92 px-4 py-3 backdrop-blur">
      <button class="flex items-center gap-1 text-sm text-slate-700" @click="router.back()">
        <span class="i-carbon-chevron-left"></span>
        返回
      </button>
      <button class="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600" @click="toggleFavorite">
        <span :class="isFavorite ? 'i-carbon-favorite-filled text-price' : 'i-carbon-favorite'"></span>
        收藏
      </button>
    </header>

    <template v-if="hotel">
      <section class="relative">
        <div class="flex snap-x overflow-x-auto">
          <img v-for="image in hotel.bannerImages" :key="image" :src="image" class="h-[264px] w-full shrink-0 snap-center object-cover" />
        </div>
      </section>

      <section class="px-4">
        <div class="-mt-7 rounded-6 bg-white p-4 shadow-card">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h1 class="text-lg font-800 text-slate-900">{{ hotel.nameCn }}</h1>
              <div class="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>{{ hotel.star }}星</span>
                <span>{{ hotel.businessArea }}</span>
                <span>{{ hotel.distanceToMetro }}</span>
              </div>
            </div>
            <div class="rounded-4 bg-emerald-50 px-2 py-1 text-right text-emerald-600">
              <div class="text-sm font-700">{{ hotel.score.toFixed(1) }}</div>
              <div class="text-[10px]">{{ hotel.reviewCount }}点评</div>
            </div>
          </div>
          <div class="mt-3 text-sm text-slate-600">{{ hotel.address }}</div>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="item in hotel.facilities.slice(0, 6)"
              :key="item.id"
              class="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600"
            >
              {{ item.name }}
            </span>
          </div>
        </div>

        <div class="mt-4 rounded-5 bg-white p-4 shadow-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-400">入住离店</div>
              <div class="mt-1 text-sm font-700 text-slate-900">{{ checkIn }} - {{ checkOut }}</div>
            </div>
            <div class="text-sm font-700 text-brand-500">{{ nights }}晚</div>
          </div>
          <div class="mt-3 rounded-4 bg-brand-50 px-3 py-2 text-xs text-brand-600">价格趋势：近 7 天房价较稳定，今晚预订更划算</div>
        </div>

        <div class="mt-4 rounded-5 bg-white p-4 shadow-card">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-700 text-slate-900">房型与价格</h2>
            <span class="text-xs text-slate-400">已按低价优先排序</span>
          </div>
          <div class="space-y-3">
            <article v-for="room in sortedRooms" :key="room.id" class="rounded-4 border border-slate-100 p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-700 text-slate-900">{{ room.name }}</div>
                  <div class="mt-1 text-xs text-slate-500">{{ room.area }} · {{ room.occupancy }}人 · {{ room.floor }} · {{ room.bedType }}</div>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span class="rounded bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600">{{ room.breakfast }}</span>
                    <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600">{{ room.cancellationPolicy }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-800 text-price">¥{{ room.price }}</div>
                  <div class="text-[10px] text-slate-400">仅剩{{ room.stock }}间</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div class="fixed bottom-0 left-0 right-0">
        <div class="mx-auto flex max-w-[430px] items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3 safe-bottom">
          <div>
            <div class="text-xs text-slate-400">最低价</div>
            <div class="text-xl font-800 text-price">¥{{ hotel.priceStart }}</div>
          </div>
          <div class="flex gap-2">
            <button class="h-11 rounded-full border border-brand-200 px-5 text-sm font-700 text-brand-500">查看房型</button>
            <button class="h-11 rounded-full bg-linear-to-r from-#ff8d3a to-#ff6a00 px-6 text-sm font-700 text-white">立即预订</button>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="px-4 py-8">
      <SkeletonHotelCard />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { fetchHotelDetail } from '@/api/hotel';
import { useBrowseStore } from '@/stores/browse';
import SkeletonHotelCard from '@/components/SkeletonHotelCard.vue';
import type { Hotel } from '@shared/types';
import { calcNights, sortRoomsByPrice } from '@shared/utils';

const route = useRoute();
const router = useRouter();
const browseStore = useBrowseStore();
const hotel = ref<Hotel | null>(null);
const checkIn = String(route.query.checkIn || dayjs().format('YYYY-MM-DD'));
const checkOut = String(route.query.checkOut || dayjs().add(1, 'day').format('YYYY-MM-DD'));

const nights = computed(() => calcNights(checkIn, checkOut));
const sortedRooms = computed(() => sortRoomsByPrice(hotel.value?.roomTypes || []));
const isFavorite = computed(() => (hotel.value ? browseStore.favorites.includes(hotel.value.id) : false));

onMounted(async () => {
  const result = await fetchHotelDetail(String(route.params.id));
  hotel.value = result;
  browseStore.addRecent(result);
});

const toggleFavorite = () => {
  if (hotel.value) browseStore.toggleFavorite(hotel.value.id);
};
</script>
