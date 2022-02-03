<template>
  <n-space>
    <n-tag v-for="item in tag" :key="item.id" closable @close="() => handleClose(item)">{{ item.metadata }}</n-tag>
  </n-space>
</template>
<script lang="ts" setup>
import { NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';
import { TimeFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();
const tag = computed(() => {
  return clueStore.timeList;
});
const handleClose = (row: TimeFormDTO) => {
  clueStore.delTime(row);
};
</script>
