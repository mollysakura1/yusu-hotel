<template>
  <main class="mobile-page pb-42 lg:pb-8">
    <header class="sticky top-0 z-20 flex items-center justify-between bg-white/92 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
      <button class="flex items-center gap-1 text-sm text-slate-700" @click="router.back()">
        <span class="i-carbon-chevron-left"></span>
        返回
      </button>
      <button
        class="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
        @click="toggleFavorite"
      >
        <span :class="isFavorite ? 'i-carbon-favorite-filled text-price' : 'i-carbon-favorite'"></span>
        收藏
      </button>
    </header>

    <template v-if="hotel">
      <section class="relative pb-4">
        <div class="relative overflow-hidden">
          <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${currentBannerIndex * 100}%)` }">
            <img
              v-for="image in hotel.bannerImages"
              :key="image"
              :src="image"
              class="h-[264px] w-full shrink-0 object-cover md:h-[340px] lg:h-[420px]"
            />
          </div>

          <button
            v-if="hotel.bannerImages.length > 1"
            class="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-black/28 text-white backdrop-blur"
            aria-label="上一张"
            @click="prevBanner"
          >
            <span class="i-carbon-chevron-left m-auto block h-5 w-5"></span>
          </button>
          <button
            v-if="hotel.bannerImages.length > 1"
            class="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-black/28 text-white backdrop-blur"
            aria-label="下一张"
            @click="nextBanner"
          >
            <span class="i-carbon-chevron-right m-auto block h-5 w-5"></span>
          </button>

          <div v-if="hotel.bannerImages.length > 1" class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            <button
              v-for="(_, index) in hotel.bannerImages"
              :key="index"
              class="h-2 rounded-full transition-all"
              :class="index === currentBannerIndex ? 'w-5 bg-white' : 'w-2 bg-white/55'"
              :aria-label="`切换到第 ${index + 1} 张`"
              @click="goBanner(index)"
            ></button>
          </div>
        </div>
      </section>

      <section class="relative z-10 -mt-2 px-4 md:px-6 lg:px-8">
        <div class="rounded-6 bg-white p-4 shadow-card">
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
          <button class="mt-3 w-full rounded-4 bg-slate-50 px-3 py-3 text-left" @click="guestVisible = true">
            <div class="mb-1 text-xs text-slate-400">间数人数</div>
            <div class="flex items-center justify-between">
              <div class="text-sm font-700 text-slate-900">{{ guestSummary }}</div>
              <span class="i-carbon-chevron-right text-slate-400"></span>
            </div>
          </button>
          <div class="mt-3 rounded-4 bg-brand-50 px-3 py-2 text-xs text-brand-600">
            价格趋势：近 7 天房价较稳定，今晚预订更划算
          </div>
        </div>

        <div class="mt-4 hidden rounded-5 bg-white p-4 shadow-card lg:block">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-xs text-slate-400">最低价</div>
              <div class="mt-1 text-2xl font-800 text-price">￥{{ hotel.priceStart }}</div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="h-11 rounded-full border border-brand-200 px-5 text-sm font-700 text-brand-500"
                @click="scrollToRooms"
              >
                查看房型
              </button>
              <button
                class="h-11 rounded-full bg-brand-500 px-6 text-sm font-700 text-white disabled:opacity-45"
                :disabled="!lowestPriceRoom"
                @click="openLowestPriceBooking"
              >
                订最低价房型
              </button>
            </div>
          </div>
        </div>

        <div ref="roomSectionRef" class="mt-4 rounded-5 bg-white p-4 shadow-card">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-700 text-slate-900">房型与价格</h2>
            <span class="text-xs text-slate-400">已按低价优先排序</span>
          </div>

          <div class="space-y-3">
            <article v-for="room in sortedRooms" :key="room.id" class="rounded-4 border border-slate-100 p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-700 text-slate-900">{{ room.name }}</div>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ room.area }} · {{ room.occupancy }}人入住 · {{ room.floor }} · {{ room.bedType }}
                  </div>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span class="rounded bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600">{{ room.breakfast }}</span>
                    <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600">{{ room.cancellationPolicy }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-800 text-price">￥{{ room.price }}</div>
                  <div class="text-[10px] text-slate-400">剩余 {{ room.stock }} 间</div>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="flex items-center rounded-full bg-slate-100 px-2 py-1">
                    <button
                      class="h-7 w-7 rounded-full text-slate-500 disabled:opacity-35"
                      :disabled="getSelectedRoomCount(room.id) <= 1"
                      @click="changeSelectedRoomCount(room.id, -1)"
                    >
                      -
                    </button>
                    <span class="w-8 text-center text-sm font-700 text-slate-900">{{ getSelectedRoomCount(room.id) }}</span>
                    <button
                      class="h-7 w-7 rounded-full text-slate-700 disabled:opacity-35"
                      :disabled="getSelectedRoomCount(room.id) >= room.stock"
                      @click="changeSelectedRoomCount(room.id, 1)"
                    >
                      +
                    </button>
                  </div>
                  <div class="text-xs text-slate-500">选择订购房间数</div>
                </div>

                <button
                  class="h-9 rounded-full bg-brand-500 px-4 text-sm font-700 text-white disabled:cursor-not-allowed disabled:opacity-45"
                  :disabled="room.stock < getSelectedRoomCount(room.id)"
                  @click="openBooking(room)"
                >
                  {{ room.stock < getSelectedRoomCount(room.id) ? '库存不足' : '立即订购' }}
                </button>
              </div>
            </article>
          </div>
        </div>

        <div v-if="bookingMessage" class="mt-4 rounded-4 bg-emerald-50 px-3 py-3 text-sm text-emerald-700 shadow-card">
          {{ bookingMessage }}
        </div>

        <div class="mt-4 rounded-5 bg-white p-4 shadow-card">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-700 text-slate-900">同城推荐酒店</h2>
              <div class="mt-1 text-xs text-slate-400">
                共 {{ recommendedHotels.length }} 家 {{ hotel.city }} 酒店，采用虚拟列表渲染
              </div>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">可视区按需渲染</span>
          </div>

          <div
            ref="recommendListRef"
            class="relative overflow-y-auto rounded-4 bg-slate-50"
            :style="{ height: `${listHeight}px` }"
            @scroll="onRecommendScroll"
          >
            <div class="relative" :style="{ height: `${totalRecommendHeight}px` }">
              <article
                v-for="item in visibleRecommendedHotels"
                :key="item.hotel.id"
                class="absolute left-0 right-0 cursor-pointer rounded-4 border border-slate-100 bg-white px-3 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                :style="{ transform: `translateY(${item.top}px)` }"
                @click="goHotel(item.hotel.id)"
              >
                <div class="flex gap-3">
                  <img
                    :src="item.hotel.coverImage"
                    :alt="item.hotel.nameCn"
                    class="h-22 w-22 shrink-0 rounded-4 object-cover"
                    loading="lazy"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="line-clamp-2 text-sm font-700 text-slate-900">{{ item.hotel.nameCn }}</div>
                    <div class="mt-1 text-xs text-slate-500">
                      {{ item.hotel.district }} · {{ item.hotel.businessArea }} · {{ item.hotel.distanceToMetro }}
                    </div>
                    <div class="mt-2 flex flex-wrap gap-1">
                      <span
                        v-for="tag in item.hotel.tags.slice(0, 3)"
                        :key="tag"
                        class="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-500"
                      >
                        {{ tag }}
                      </span>
                    </div>
                    <div class="mt-3 flex items-end justify-between gap-3">
                      <div class="text-[11px] text-slate-400">
                        {{ item.hotel.reviewCount }} 条点评 · {{ item.hotel.score.toFixed(1) }} 分
                      </div>
                      <div class="text-right text-lg font-800 text-price">￥{{ item.hotel.priceStart }}</div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div class="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 md:max-w-[720px] lg:hidden">
        <div
          class="flex items-center justify-between gap-3 border-t border-slate-100 bg-white/98 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur safe-bottom"
        >
          <div class="shrink-0">
            <div class="text-xs text-slate-400">最低价</div>
            <div class="text-xl font-800 text-price">￥{{ hotel.priceStart }}</div>
          </div>
          <div class="ml-auto flex shrink-0 items-center gap-2">
            <button
              class="h-11 shrink-0 rounded-full border border-brand-200 px-5 text-sm font-700 text-brand-500"
              @click="scrollToRooms"
            >
              查看房型
            </button>
            <button
              class="h-11 shrink-0 rounded-full bg-brand-500 px-6 text-sm font-700 text-white disabled:opacity-45"
              :disabled="!lowestPriceRoom"
              @click="openLowestPriceBooking"
            >
              订最低价房型
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="px-4 py-8">
      <SkeletonHotelCard />
    </div>

    <GuestCountModal
      :visible="guestVisible"
      :model-value="guestValue"
      @close="guestVisible = false"
      @confirm="applyGuest"
    />
    <BookingConfirmModal
      :visible="bookingModalVisible"
      :room="activeBookingRoom"
      :hotel-name="hotel?.nameCn || ''"
      :check-in="checkIn"
      :check-out="checkOut"
      :nights="nights"
      :initial-room-count="activeBookingRoom ? getSelectedRoomCount(activeBookingRoom.id) : 1"
      :adult-count="query.adultCount || 1"
      :child-count="query.childCount || 0"
      :submitting="bookingSubmitting"
      @close="closeBookingModal"
      @submit="submitBooking"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { bookHotelRoom, fetchHotelDetail, fetchHotels } from '@/api/hotel';
import { useBrowseStore } from '@/stores/browse';
import SkeletonHotelCard from '@/components/SkeletonHotelCard.vue';
import GuestCountModal from '@/components/GuestCountModal.vue';
import BookingConfirmModal from '@/components/BookingConfirmModal.vue';
import type { Hotel, RoomType, SearchQuery } from '@shared/types';
import { calcNights, sortRoomsByPrice } from '@shared/utils';

const route = useRoute();
const router = useRouter();
const browseStore = useBrowseStore();
const hotel = ref<Hotel | null>(null);
const recommendedHotels = ref<Hotel[]>([]);
const recommendListRef = ref<HTMLElement | null>(null);
const roomSectionRef = ref<HTMLElement | null>(null);
const recommendScrollTop = ref(0);
const guestVisible = ref(false);
const bookingMessage = ref('');
const bookingModalVisible = ref(false);
const bookingSubmitting = ref(false);
const activeBookingRoom = ref<RoomType | null>(null);
const currentBannerIndex = ref(0);
const selectedRoomCounts = ref<Record<string, number>>({});
const listHeight = 560;
const recommendItemHeight = 128;
const recommendOverscan = 4;
let bannerTimer: ReturnType<typeof setInterval> | null = null;

const query = computed<SearchQuery>(() => ({
  city: String(route.query.city || hotel.value?.city || '上海'),
  keyword: String(route.query.keyword || ''),
  checkIn: String(route.query.checkIn || dayjs().format('YYYY-MM-DD')),
  checkOut: String(route.query.checkOut || dayjs().add(1, 'day').format('YYYY-MM-DD')),
  roomCount: Number(route.query.roomCount || 1),
  adultCount: Number(route.query.adultCount || 1),
  childCount: Number(route.query.childCount || 0)
}));

const checkIn = computed(() => query.value.checkIn);
const checkOut = computed(() => query.value.checkOut);
const nights = computed(() => calcNights(checkIn.value, checkOut.value));
const guestSummary = computed(
  () => `${query.value.roomCount || 1}间房 ${query.value.adultCount || 1}成人 ${query.value.childCount || 0}儿童`
);
const guestValue = computed(() => ({
  roomCount: query.value.roomCount || 1,
  adultCount: query.value.adultCount || 1,
  childCount: query.value.childCount || 0
}));
const sortedRooms = computed(() => sortRoomsByPrice(hotel.value?.roomTypes || []));
const lowestPriceRoom = computed(() => sortedRooms.value.find((item) => item.stock > 0) || null);
const isFavorite = computed(() => (hotel.value ? browseStore.favorites.includes(hotel.value.id) : false));
const totalRecommendHeight = computed(() => recommendedHotels.value.length * recommendItemHeight);
const visibleRecommendedHotels = computed(() => {
  const start = Math.max(0, Math.floor(recommendScrollTop.value / recommendItemHeight) - recommendOverscan);
  const visibleCount = Math.ceil(listHeight / recommendItemHeight) + recommendOverscan * 2;

  return recommendedHotels.value.slice(start, start + visibleCount).map((item, index) => ({
    hotel: item,
    top: (start + index) * recommendItemHeight
  }));
});

const getSelectedRoomCount = (roomId: string) => selectedRoomCounts.value[roomId] || 1;

const changeSelectedRoomCount = (roomId: string, delta: number) => {
  const room = sortedRooms.value.find((item) => item.id === roomId);
  if (!room) return;
  const current = getSelectedRoomCount(roomId);
  selectedRoomCounts.value = {
    ...selectedRoomCounts.value,
    [roomId]: Math.min(room.stock, Math.max(1, current + delta))
  };
};

const closeBookingModal = () => {
  bookingModalVisible.value = false;
  activeBookingRoom.value = null;
};

const openBooking = (room: RoomType) => {
  activeBookingRoom.value = room;
  bookingModalVisible.value = true;
};

const openLowestPriceBooking = () => {
  if (!lowestPriceRoom.value) return;
  openBooking(lowestPriceRoom.value);
};

const stopBannerAutoplay = () => {
  if (!bannerTimer) return;
  clearInterval(bannerTimer);
  bannerTimer = null;
};

const startBannerAutoplay = () => {
  stopBannerAutoplay();
  if (!hotel.value || hotel.value.bannerImages.length <= 1) return;
  const bannerCount = hotel.value.bannerImages.length;
  bannerTimer = setInterval(() => {
    currentBannerIndex.value = currentBannerIndex.value >= bannerCount - 1 ? 0 : currentBannerIndex.value + 1;
  }, 3500);
};

const prevBanner = () => {
  if (!hotel.value) return;
  currentBannerIndex.value =
    currentBannerIndex.value === 0 ? hotel.value.bannerImages.length - 1 : currentBannerIndex.value - 1;
  startBannerAutoplay();
};

const nextBanner = () => {
  if (!hotel.value) return;
  currentBannerIndex.value =
    currentBannerIndex.value >= hotel.value.bannerImages.length - 1 ? 0 : currentBannerIndex.value + 1;
  startBannerAutoplay();
};

const goBanner = (index: number) => {
  currentBannerIndex.value = index;
  startBannerAutoplay();
};

const syncQuery = (payload: { roomCount: number; adultCount: number; childCount: number }) => {
  router.replace({
    query: {
      ...route.query,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      roomCount: String(payload.roomCount),
      adultCount: String(payload.adultCount),
      childCount: String(payload.childCount)
    }
  });
};

const loadRecommendedHotels = async (city: string, currentHotelId: string) => {
  const result = await fetchHotels({
    city,
    keyword: '',
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    roomCount: query.value.roomCount,
    adultCount: query.value.adultCount,
    childCount: query.value.childCount,
    sortBy: 'recommended',
    page: 1,
    pageSize: 200
  });

  recommendedHotels.value = result.list.filter((item) => item.id !== currentHotelId);
  recommendScrollTop.value = 0;
  if (recommendListRef.value) recommendListRef.value.scrollTop = 0;
};

const loadHotel = async (id: string) => {
  const result = await fetchHotelDetail(id);
  hotel.value = result;
  currentBannerIndex.value = 0;
  bookingMessage.value = '';
  selectedRoomCounts.value = Object.fromEntries(result.roomTypes.map((room) => [room.id, 1]));
  browseStore.addRecent(result);
  await loadRecommendedHotels(result.city, result.id);
  startBannerAutoplay();
};

const toggleFavorite = () => {
  if (hotel.value) browseStore.toggleFavorite(hotel.value.id);
};

const applyGuest = (value: { roomCount: number; adultCount: number; childCount: number }) => {
  guestVisible.value = false;
  syncQuery(value);
};

const onRecommendScroll = () => {
  recommendScrollTop.value = recommendListRef.value?.scrollTop || 0;
};

const goHotel = (id: string) => {
  router.push({
    name: 'hotel-detail',
    params: { id },
    query: {
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      roomCount: String(query.value.roomCount || 1),
      adultCount: String(query.value.adultCount || 1),
      childCount: String(query.value.childCount || 0)
    }
  });
};

const scrollToRooms = async () => {
  await nextTick();
  roomSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const submitBooking = async (payload: { roomId: string; roomCount: number; guestName: string; phone: string }) => {
  if (!hotel.value) return;
  bookingSubmitting.value = true;
  bookingMessage.value = '';

  try {
    const result = await bookHotelRoom(hotel.value.id, {
      roomId: payload.roomId,
      roomCount: payload.roomCount,
      adultCount: query.value.adultCount || 1,
      childCount: query.value.childCount || 0
    });
    hotel.value = result;
    selectedRoomCounts.value = {
      ...selectedRoomCounts.value,
      [payload.roomId]: 1
    };
    const bookedRoom = result.roomTypes.find((item) => item.id === payload.roomId);
    bookingMessage.value = `预订成功，${bookedRoom?.name || '所选房型'} 库存已更新，当前剩余 ${bookedRoom?.stock ?? 0} 间。`;
    closeBookingModal();
  } catch (error: any) {
    bookingMessage.value = error?.message || '预订失败，请稍后重试。';
  } finally {
    bookingSubmitting.value = false;
  }
};

onMounted(() => {
  loadHotel(String(route.params.id));
});

onBeforeUnmount(() => {
  stopBannerAutoplay();
});

watch(
  () => route.params.id,
  (id, prevId) => {
    if (!id || id === prevId) return;
    closeBookingModal();
    loadHotel(String(id));
  }
);
</script>
