<template>
  <div class="flex gap-2 overflow-x-auto pb-1">
    <button
      v-for="item in options"
      :key="item"
      type="button"
      class="shrink-0 rounded-full border px-3 py-1.5 text-xs transition"
      :class="
        modelValue.includes(item)
          ? 'border-brand-500 bg-brand-50 text-brand-500'
          : 'border-slate-200 bg-white text-slate-600'
      "
      @click="toggle(item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  options: string[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const toggle = (value: string) => {
  emit(
    'update:modelValue',
    props.modelValue.includes(value)
      ? props.modelValue.filter((item) => item !== value)
      : [...props.modelValue, value]
  );
};
</script>
