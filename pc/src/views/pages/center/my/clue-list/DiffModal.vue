<template>
  <imp-modal ref="ImpModalRef" :width="800" title="对比数据线索">
    <Diff mode="unified" theme="dark" :prev="modelRef.metadata" :current="modelRef.correctdata" folding></Diff>
    <template #footer>
      <n-space>
        <n-button type="primary" @click="save()">保存</n-button>
        <n-button @click="close()">返回</n-button>
      </n-space>
    </template>
  </imp-modal>
</template>
<script lang="ts" setup>
import { NSpace, NButton } from 'naive-ui';
import { ref } from 'vue';
import { RawClueFormDTO, useClueStore } from '/@/store/modules/clue';

const emit = defineEmits(['load-page']);
const clueStore = useClueStore();
// refs
const ImpModalRef = ref();
// ref
const modelRef = ref(new RawClueFormDTO());
// methods
const diff = (row: IObj) => {
  modelRef.value.mergeProperties(row);
  ImpModalRef.value.showModal = true;
};
const save = () => {
  const isNew = clueStore.rawClueList.findIndex((m) => modelRef.value.id === m.id) < 0;
  if (isNew) {
    modelRef.value.initData();
  }
  clueStore.addRawClue(modelRef.value);
  window.$message.success('保存成功');
  close();
};
const close = () => {
  modelRef.value = new RawClueFormDTO();
  ImpModalRef.value.showModal = false;
  emit('load-page');
};

defineExpose({
  diff,
  close,
});
</script>
