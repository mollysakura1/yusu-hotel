<template>
  <div class="rounded-4 bg-white shadow-card p-3">
    <div class="mb-3 flex items-center justify-between">
      <div>
        <div class="text-xs text-slate-500">入住</div>
        <div class="mt-1 text-sm font-600 text-slate-900">{{ modelValue.checkIn }}</div>
      </div>
      <div class="text-xs text-brand-500 font-700">{{ nights }} 晚</div>
      <div class="text-right">
        <div class="text-xs text-slate-500">离店</div>
        <div class="mt-1 text-sm font-600 text-slate-900">{{ modelValue.checkOut }}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <label class="rounded-3 bg-slate-50 px-3 py-2 text-sm">
        <span class="mb-1 block text-xs text-slate-400">入住日期</span>
        <input
          :value="modelValue.checkIn"
          type="date"
          class="w-full bg-transparent outline-none"
          @input="update('checkIn', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="rounded-3 bg-slate-50 px-3 py-2 text-sm">
        <span class="mb-1 block text-xs text-slate-400">离店日期</span>
        <input
          :value="modelValue.checkOut"
          type="date"
          class="w-full bg-transparent outline-none"
          @input="update('checkOut', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calcNights } from '@shared/utils';

const props = defineProps<{
  modelValue: { checkIn: string; checkOut: string };
}>();

const emit = defineEmits<{
  'update:modelValue': [value: { checkIn: string; checkOut: string }];
}>();

const nights = computed(() => calcNights(props.modelValue.checkIn, props.modelValue.checkOut));

const update = (field: 'checkIn' | 'checkOut', value: string) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
