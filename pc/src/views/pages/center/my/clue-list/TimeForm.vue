<template>
  <n-form style="margin-top: 20px" label-placement="left" :model="modelTime" ref="formRef">
    <n-form-item label="元数据">
      <n-input v-model:value="modelTime.metadata" clearable></n-input>
    </n-form-item>
    <n-form-item label="查找时间">
      <n-select v-model:value="value" :options="options" />
    </n-form-item>
    <n-form-item label="准确时间">
      <n-date-picker v-model:value="modelTime.value" type="datetime" clearable></n-date-picker>
    </n-form-item>
    <n-form-item>
      <n-button @click="handleSubTime()">提交</n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NInput, NButton, NDatePicker, NSelect } from 'naive-ui';
import { computed, ref, watchEffect } from 'vue';
import { TimeFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();
const value = ref<number | null>(null);
const modelTime = ref(new TimeFormDTO());
watchEffect(() => {
  modelTime.value.value = value.value;
});
const options = computed(() => {
  return clueStore.timeList.map((m) => {
    return {
      label: m.metadata,
      value: m.value,
    };
  });
});
const handleSubTime = () => {
  clueStore.addTime(modelTime.value);
  window.$message.success('保存成功');
  init();
};
const init = () => {
  modelTime.value = new TimeFormDTO();
};
defineExpose({
  init,
});
</script>
<style lang="css" scoped>
.form-map {
  height: 400px;
}
</style>
