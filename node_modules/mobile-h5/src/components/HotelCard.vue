<template>
  <article
    class="rounded-5 bg-white p-3 shadow-card"
    @click="$router.push({ name: 'hotel-detail', params: { id: hotel.id } })"
  >
    <div class="flex gap-3">
      <img :src="hotel.coverImage" :alt="hotel.nameCn" class="h-28 w-28 rounded-4 object-cover" loading="lazy" />
      <div class="min-w-0 flex-1">
        <div class="line-clamp-2 text-sm font-700 text-slate-900">{{ hotel.nameCn }}</div>
        <div class="mt-1 flex items-center gap-1 text-xs text-amber-500">
          <span v-for="item in hotel.star" :key="item" class="i-carbon-star-filled"></span>
          <span class="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-600">{{ hotel.score.toFixed(1) }}分</span>
        </div>
        <div class="mt-2 text-xs text-slate-500">{{ hotel.district }} · {{ hotel.businessArea }} · {{ hotel.distanceToMetro }}</div>
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="tag in hotel.tags.slice(0, 3)"
            :key="tag"
            class="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-500"
          >
            {{ tag }}
          </span>
        </div>
        <div class="mt-3 flex items-end justify-between">
          <div>
            <div class="text-[10px] text-slate-400">推荐理由</div>
            <div class="text-xs text-slate-600">{{ hotel.recommendedText || '高分口碑，出行高效' }}</div>
          </div>
          <div class="text-right">
            <div class="text-lg font-800 text-price">¥{{ hotel.priceStart }}<span class="text-[10px] text-slate-400 font-400">起/晚</span></div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Hotel } from '@shared/types';

defineProps<{ hotel: Hotel }>();
</script>
