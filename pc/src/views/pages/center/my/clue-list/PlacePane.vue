<template>
  <n-space>
    <n-tag v-for="item in tag" :key="item.id" closable @close="() => handleClose(item)">{{ item.name }}</n-tag>
  </n-space>
</template>
<script lang="ts" setup>
import { NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';
import { PlaceFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();
const tag = computed(() => {
  return clueStore.placeList;
});
const handleClose = (row: PlaceFormDTO) => {
  clueStore.delPlace(row);
};
</script>
