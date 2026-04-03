<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-end justify-center bg-black/35"
    @click.self="$emit('close')"
  >
    <div class="max-h-[86vh] w-full max-w-[430px] overflow-hidden rounded-t-7 bg-white">
      <div class="border-b border-slate-100 px-4 pt-4">
        <div class="flex items-center justify-between">
          <button class="h-8 w-8 flex items-center justify-center text-slate-400" @click="$emit('close')" aria-label="关闭">
            <svg viewBox="0 0 24 24" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <div class="text-base font-700 text-slate-900">指定日期</div>
          <div class="w-8"></div>
        </div>
        <div class="mt-4 flex items-center justify-center gap-8 border-b border-slate-100 text-sm">
          <button
            class="relative pb-3"
            :class="step === 'checkIn' ? 'font-700 text-brand-500' : 'text-slate-400'"
            @click="step = 'checkIn'"
          >
            入住
            <span v-if="step === 'checkIn'" class="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded bg-brand-500"></span>
          </button>
          <button
            class="relative pb-3"
            :class="step === 'checkOut' ? 'font-700 text-brand-500' : 'text-slate-400'"
            @click="step = 'checkOut'"
          >
            离店
            <span v-if="step === 'checkOut'" class="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded bg-brand-500"></span>
          </button>
        </div>
        <div class="grid grid-cols-7 py-3 text-center text-xs text-slate-400">
          <span v-for="week in weeks" :key="week">{{ week }}</span>
        </div>
      </div>

      <div class="max-h-[58vh] overflow-y-auto px-4 pb-4">
        <section v-for="month in months" :key="month.title" class="mb-6">
          <div class="sticky top-0 bg-white py-3 text-xl font-700 text-slate-900">{{ month.title }}</div>
          <div class="grid grid-cols-7 gap-y-2 text-center">
            <div v-for="blank in month.leadingBlank" :key="`${month.title}-blank-${blank}`" class="h-12"></div>
            <button
              v-for="day in month.days"
              :key="day.date"
              class="relative h-12 rounded-4 text-sm transition"
              :class="dayClass(day)"
              :disabled="day.disabled"
              @click="selectDate(day.date)"
            >
              <span class="block">{{ day.label }}</span>
              <span v-if="day.isToday" class="mt-0.5 block text-[10px] text-slate-400">今天</span>
              <span v-if="day.date === draft.checkIn" class="absolute inset-x-0 bottom-1 text-[10px]">入住</span>
              <span v-if="draft.checkOut && day.date === draft.checkOut" class="absolute inset-x-0 bottom-1 text-[10px]">离店</span>
            </button>
          </div>
        </section>
      </div>

      <div class="border-t border-slate-100 p-4">
        <button
          class="h-12 w-full rounded-full text-base font-700 text-white"
          :class="{ 'opacity-45 pointer-events-none': !canConfirm }"
          style="background: linear-gradient(135deg, #0f6fff 0%, #1677ff 55%, #3293ff 100%)"
          @click="confirm"
        >
          {{ canConfirm ? `完成（${nights}晚）` : '请选择离店日期' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { calcNights, normalizeDateRange } from '@shared/utils';

const props = defineProps<{
  visible: boolean;
  modelValue: {
    checkIn: string;
    checkOut: string;
  };
}>();

const emit = defineEmits<{
  close: [];
  confirm: [value: { checkIn: string; checkOut: string }];
}>();

const weeks = ['日', '一', '二', '三', '四', '五', '六'];
const step = ref<'checkIn' | 'checkOut'>('checkIn');
const draft = reactive({
  checkIn: '',
  checkOut: ''
});
const today = dayjs().startOf('day');

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return;
    Object.assign(draft, normalizeDateRange(props.modelValue.checkIn, props.modelValue.checkOut));
    step.value = 'checkIn';
  }
);

const months = computed(() =>
  [0, 1].map((offset) => {
    const firstDay = today.startOf('month').add(offset, 'month');
    const daysInMonth = firstDay.daysInMonth();
    return {
      title: `${firstDay.year()}年 ${firstDay.month() + 1}月`,
      leadingBlank: firstDay.day(),
      days: Array.from({ length: daysInMonth }).map((_, index) => {
        const current = firstDay.date(index + 1);
        return {
          date: current.format('YYYY-MM-DD'),
          label: current.date(),
          isToday: current.isSame(today, 'day'),
          disabled: current.isBefore(today, 'day')
        };
      })
    };
  })
);

const nights = computed(() => (draft.checkOut ? calcNights(draft.checkIn, draft.checkOut) : 0));
const canConfirm = computed(() => Boolean(draft.checkIn && draft.checkOut));

const dayClass = (day: { date: string; disabled: boolean }) => {
  if (day.disabled) return 'text-slate-300';
  if (day.date === draft.checkIn || (draft.checkOut && day.date === draft.checkOut)) return 'bg-brand-500 text-white font-700';
  if (
    draft.checkOut &&
    dayjs(day.date).isAfter(dayjs(draft.checkIn), 'day') &&
    dayjs(day.date).isBefore(dayjs(draft.checkOut), 'day')
  ) {
    return 'bg-brand-50 text-brand-500';
  }
  return 'text-slate-700';
};

const selectDate = (date: string) => {
  if (!draft.checkIn || (draft.checkIn && draft.checkOut)) {
    draft.checkIn = date;
    draft.checkOut = '';
    step.value = 'checkOut';
    return;
  }

  if (!dayjs(date).isAfter(dayjs(draft.checkIn), 'day')) {
    draft.checkIn = date;
    draft.checkOut = '';
    step.value = 'checkOut';
    return;
  }

  draft.checkOut = date;
};

const confirm = () => {
  if (!canConfirm.value) return;
  emit('confirm', normalizeDateRange(draft.checkIn, draft.checkOut));
};
</script>
