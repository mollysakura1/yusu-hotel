<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-end justify-center bg-black/35"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-[430px] rounded-t-7 bg-white px-4 pb-6 pt-4 md:max-w-[560px]">
      <div class="flex items-center justify-between">
        <button class="h-8 w-8 text-slate-400" @click="$emit('close')" aria-label="关闭">
          <span class="i-carbon-close block h-5 w-5"></span>
        </button>
        <div class="text-base font-700 text-slate-900">选择入住人数</div>
        <div class="w-8"></div>
      </div>

      <div class="mt-5 space-y-4">
        <div
          v-for="item in items"
          :key="item.key"
          class="flex items-center justify-between rounded-4 bg-slate-50 px-4 py-3"
        >
          <div>
            <div class="text-sm font-700 text-slate-900">{{ item.label }}</div>
            <div class="mt-1 text-xs text-slate-400">{{ item.tip }}</div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="h-8 w-8 rounded-full border border-slate-200 text-slate-500 disabled:opacity-35"
              :disabled="isMin(item.key)"
              @click="changeCount(item.key, -1)"
            >
              -
            </button>
            <span class="w-6 text-center text-sm font-700 text-slate-900">{{ draft[item.key] }}</span>
            <button class="h-8 w-8 rounded-full border border-slate-200 text-slate-700" @click="changeCount(item.key, 1)">
              +
            </button>
          </div>
        </div>
      </div>

      <button
        class="mt-6 h-12 w-full rounded-full text-base font-700 text-white"
        style="background: linear-gradient(135deg, #0f6fff 0%, #1677ff 55%, #3293ff 100%)"
        @click="confirm"
      >
        确认
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

type GuestCountValue = {
  roomCount: number;
  adultCount: number;
  childCount: number;
};

const props = defineProps<{
  visible: boolean;
  modelValue: GuestCountValue;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [value: GuestCountValue];
}>();

const draft = reactive<GuestCountValue>({
  roomCount: 1,
  adultCount: 1,
  childCount: 0
});

const items = [
  { key: 'roomCount' as const, label: '房间数', tip: '建议按实际入住需求选择' },
  { key: 'adultCount' as const, label: '成人', tip: '至少 1 位成人' },
  { key: 'childCount' as const, label: '儿童', tip: '未成年入住请以酒店政策为准' }
];

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return;
    Object.assign(draft, props.modelValue);
  }
);

const isMin = (key: keyof GuestCountValue) => {
  if (key === 'childCount') return draft.childCount <= 0;
  return draft[key] <= 1;
};

const changeCount = (key: keyof GuestCountValue, delta: number) => {
  if (key === 'childCount') {
    draft.childCount = Math.max(0, draft.childCount + delta);
    return;
  }
  draft[key] = Math.max(1, draft[key] + delta);
};

const confirm = () => {
  emit('confirm', { ...draft });
};
</script>
