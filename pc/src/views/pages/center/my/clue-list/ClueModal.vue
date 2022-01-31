<template>
  <imp-modal ref="ImpModalRef" title="添加原始线索">
    <n-form :model="modelRef" ref="formRef">
      <n-form-item path="name" label="数据名称">
        <n-input v-model:value="modelRef.name" />
      </n-form-item>
      <n-form-item path="metadata" label="元数据">
        <n-input
          v-model:value="modelRef.metadata"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 8,
          }"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space>
        <n-button type="primary" @click="save()">保存</n-button>
        <n-button @click="close()">返回</n-button>
      </n-space>
    </template>
  </imp-modal>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NInput, NSpace, NButton } from 'naive-ui';
import { ref } from 'vue';
import { RawClueFormDTO, useClueStore } from '/@/store/modules/clue';
const emit = defineEmits(['load-page']);
const clueStore = useClueStore();
// refs
const ImpModalRef = ref();
// ref
const modelRef = ref(new RawClueFormDTO());
// methods
const open = (row?: IObj) => {
  if (row) {
    modelRef.value.mergeProperties(row);
  }
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
  open,
  close,
});
</script>
