<template>
  <imp-modal ref="ImpModalRef" :width="800" title="数据分词">
    <n-form :model="modelRef" ref="formRef">
      <n-form-item path="name" label="数据名称">
        <n-input v-model:value="modelRef.name" disabled />
      </n-form-item>
      <n-form-item path="correctdata" label="数据分词">
        <n-scrollbar style="max-height: 500px">
          <n-el tag="p">
            <span :class="dotType(item.flag)" v-for="(item, idx) in modelRef.splitdata" :key="idx">{{ item.word }}</span>
          </n-el>
        </n-scrollbar>
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
import { NForm, NFormItem, NInput, NSpace, NButton, NEl, NScrollbar } from 'naive-ui';
import { ref } from 'vue';
import { RawClueFormDTO, useClueStore } from '/@/store/modules/clue';
const emit = defineEmits(['load-page']);
const clueStore = useClueStore();
// refs
const ImpModalRef = ref();
// ref
const modelRef = ref(new RawClueFormDTO());
// methods
const dotType = (flag: string) => {
  if (flag === 'ns' || flag === 'LOC' || flag === 'nt') {
    return 'success';
  } else if (flag === 'TIME') {
    return 'warning';
  } else if (flag === 'nr' || flag === 'PER') {
    return 'info';
  } else {
    return '';
  }
};
const split = (row: IObj) => {
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
  split,
  close,
});
</script>
<style lang="css" scoped>
span.success {
  color: var(--success-color);
}
span.info {
  color: var(--info-color);
}
span.warning {
  color: var(--warning-color);
}
</style>
