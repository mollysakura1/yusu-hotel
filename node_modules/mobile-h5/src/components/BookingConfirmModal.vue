<template>
  <div
    v-if="visible && room"
    class="fixed inset-0 z-60 flex items-end justify-center bg-black/40"
    @click.self="$emit('close')"
  >
    <div class="max-h-[88vh] w-full max-w-[430px] overflow-y-auto rounded-t-7 bg-#f6f8fc pb-6 md:max-w-[640px] lg:max-w-[720px]">
      <div class="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <button class="h-8 w-8 text-slate-500" @click="$emit('close')" aria-label="关闭">
          <span class="i-carbon-chevron-left block h-5 w-5"></span>
        </button>
        <div class="text-base font-800 text-slate-900">确认预订</div>
        <div class="w-8"></div>
      </div>

      <div class="px-4 pt-4">
        <section class="rounded-5 bg-white p-4 shadow-card">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-lg font-800 text-slate-900">{{ hotelName }}</div>
              <div class="mt-3 flex items-center gap-3 text-sm font-700 text-slate-900">
                <span>{{ checkIn.slice(5) }} - {{ checkOut.slice(5) }}</span>
                <span class="text-slate-300">|</span>
                <span>{{ nights }}晚</span>
              </div>
              <div class="mt-2 text-xs text-slate-500">
                15:00 后入住 · 12:00 前退房
              </div>
            </div>
            <div class="text-sm font-700 text-brand-500">房型详情</div>
          </div>

          <div class="mt-4 border-t border-slate-100 pt-4">
            <div class="text-base font-700 text-slate-900">{{ room.name }}</div>
            <div class="mt-2 text-sm text-slate-600">
              {{ room.area }} · {{ room.occupancy }}人入住 · {{ room.floor }} · {{ room.bedType }}
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-600">{{ room.breakfast }}</span>
              <span class="rounded bg-emerald-50 px-2 py-1 text-[11px] text-emerald-600">{{ room.cancellationPolicy }}</span>
            </div>
          </div>
        </section>

        <section class="mt-4 rounded-5 bg-white p-4 shadow-card">
          <div class="flex items-center justify-between">
            <div class="text-xl font-800 text-slate-900">订房信息</div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-700 text-red-500">仅剩 {{ room.stock }} 间</span>
              <div class="flex items-center rounded-full bg-slate-100 px-2 py-1">
                <button
                  class="h-7 w-7 rounded-full text-slate-500 disabled:opacity-35"
                  :disabled="draft.roomCount <= 1"
                  @click="changeCount(-1)"
                >
                  -
                </button>
                <span class="w-10 text-center text-lg font-700 text-slate-900">{{ draft.roomCount }}</span>
                <button
                  class="h-7 w-7 rounded-full text-slate-700 disabled:opacity-35"
                  :disabled="draft.roomCount >= room.stock"
                  @click="changeCount(1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="mt-5 border-t border-slate-100 pt-4">
            <label class="block">
              <div class="mb-2 text-sm font-700 text-slate-900">住客姓名 <span class="text-red-500">*</span></div>
              <input
                v-model="draft.guestName"
                class="w-full rounded-4 border border-slate-200 px-3 py-3 text-sm outline-none focus:border-brand-400"
                placeholder="请输入入住客姓名"
              />
            </label>
            <div class="mt-2 rounded-4 bg-amber-50 px-3 py-2 text-sm text-amber-600">
              请输入入住客姓名，每间只需填写 1 人
            </div>
          </div>

          <div class="mt-4 border-t border-slate-100 pt-4">
            <label class="block">
              <div class="mb-2 text-sm font-700 text-slate-900">联系手机 <span class="text-red-500">*</span></div>
              <div class="flex items-center gap-3 rounded-4 border border-slate-200 px-3 py-3">
                <span class="shrink-0 text-sm text-slate-700">+86</span>
                <input
                  v-model="draft.phone"
                  class="w-full min-w-0 text-sm outline-none"
                  placeholder="请输入联系手机号"
                />
              </div>
            </label>
          </div>
        </section>

        <section class="mt-4 rounded-5 bg-white p-4 shadow-card">
          <div class="text-xl font-800 text-slate-900">本单可享</div>
          <div class="mt-4 space-y-4 text-sm text-slate-700">
            <div class="flex items-center justify-between gap-3">
              <span>赠送</span>
              <span class="truncate text-slate-500">迷你吧 1 份 + 欢迎曲奇 1 份 + 当季特饮 1 份</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span>离店赚积分</span>
              <span class="text-slate-500">{{ totalPoints }} 积分</span>
            </div>
          </div>
        </section>
      </div>

      <div class="fixed bottom-0 left-1/2 z-70 w-full max-w-[430px] -translate-x-1/2 md:max-w-[640px] lg:max-w-[720px]">
        <div class="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3 shadow-[0_-10px_24px_rgba(15,23,42,0.08)] safe-bottom">
          <div class="min-w-0">
            <div class="text-sm text-slate-500">在线付</div>
            <div class="text-2xl font-800 text-brand-500">￥{{ totalPrice.toFixed(2) }}</div>
          </div>
          <button
            class="h-12 rounded-full bg-brand-500 px-8 text-base font-700 text-white disabled:opacity-45"
            :disabled="submitting || !canSubmit"
            @click="submit"
          >
            {{ submitting ? '提交中...' : '立即支付' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { RoomType } from '@shared/types';

const props = defineProps<{
  visible: boolean;
  room: RoomType | null;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  initialRoomCount: number;
  adultCount: number;
  childCount: number;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [value: { roomId: string; roomCount: number; guestName: string; phone: string }];
}>();

const draft = reactive({
  roomCount: 1,
  guestName: '',
  phone: '18623060902'
});

watch(
  () => [props.visible, props.room?.id, props.initialRoomCount],
  () => {
    if (!props.visible || !props.room) return;
    draft.roomCount = Math.min(Math.max(1, props.initialRoomCount || 1), props.room.stock || 1);
    draft.guestName = '';
  }
);

const totalPrice = computed(() => (props.room ? props.room.price * draft.roomCount * props.nights : 0));
const totalPoints = computed(() => Math.round(totalPrice.value / 2));
const canSubmit = computed(() => Boolean(props.room && draft.guestName.trim() && /^1\d{10}$/.test(draft.phone)));

const changeCount = (delta: number) => {
  if (!props.room) return;
  draft.roomCount = Math.min(props.room.stock, Math.max(1, draft.roomCount + delta));
};

const submit = () => {
  if (!props.room || !canSubmit.value) return;
  emit('submit', {
    roomId: props.room.id,
    roomCount: draft.roomCount,
    guestName: draft.guestName.trim(),
    phone: draft.phone.trim()
  });
};
</script>
