<template>
  <n-form style="margin-top: 20px" label-placement="left" :model="modelThing" ref="formRef">
    <n-form-item label="元数据">
      <n-input v-model:value="modelThing.metadata"></n-input>
    </n-form-item>
    <n-form-item label="编号">
      <n-input v-model:value="modelThing.no"></n-input>
    </n-form-item>
    <n-form-item label="性别">
      <n-input v-model:value="modelThing.sex"></n-input>
    </n-form-item>
    <n-form-item label="年龄">
      <n-input v-model:value="modelThing.age"></n-input>
    </n-form-item>
    <n-form-item label="住宅">
      <place-select v-model:value="modelThing.house"></place-select>
    </n-form-item>
    <n-form-item label="工作地">
      <place-select v-model:value="modelThing.work"></place-select>
    </n-form-item>
    <n-form-item label="交通工具">
      <n-input v-model:value="modelThing.traffic"></n-input>
    </n-form-item>
    <n-form-item label="隔离">
      <n-date-picker v-model:value="modelThing.end" type="date" clearable />
    </n-form-item>
    <n-form-item>
      <n-button @click="handleSubThing()">提交</n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NButton, NInput, NDatePicker } from 'naive-ui';
import { ref } from 'vue';
import { ThingFormDTO, useClueStore } from '/@/store/modules/clue';
import PlaceSelect from './PlaceSelect.vue';

const clueStore = useClueStore();

const modelThing = ref(new ThingFormDTO());

const handleSubThing = () => {
  clueStore.addThing(modelThing.value);
  window.$message.success('保存成功');
  init();
};
const init = () => {
  modelThing.value = new ThingFormDTO();
};
defineExpose({
  init,
});
</script>
