<template>
  <n-space>
    <n-tag v-for="item in tag" :key="item.id" closable @close="() => handleClose(item)">确诊病例{{ item.no }}</n-tag>
  </n-space>
</template>
<script lang="ts" setup>
import { NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';
import { ThingFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();
const tag = computed(() => {
  return clueStore.thingList;
});
const handleClose = (row: ThingFormDTO) => {
  clueStore.delThing(row);
};
</script>
