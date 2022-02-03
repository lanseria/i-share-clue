<template>
  <n-select filterable v-model:value="value" :options="options" />
</template>
<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import { NSelect } from 'naive-ui';
import { computed } from 'vue';
import { useClueStore } from '/@/store/modules/clue';
const emit = defineEmits(['update:value']);
const props = defineProps({
  value: String,
});
const clueStore = useClueStore();
const value = useVModel(props, 'value', emit);
const options = computed(() => {
  return clueStore.thingList.map((m) => {
    return {
      value: m.id,
      label: `确诊病例${m.no}`,
    };
  });
});
</script>
