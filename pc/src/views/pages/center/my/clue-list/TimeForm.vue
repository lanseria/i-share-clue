<template>
  <n-form style="margin-top: 20px" label-placement="left" :model="modelTime" ref="formRef">
    <n-form-item label="元数据">
      <n-input-group>
        <n-input v-model:value="modelTime.metadata" clearable></n-input>
        <n-button type="primary" @click="search()" ghost>匹配</n-button>
      </n-input-group>
    </n-form-item>
    <n-form-item label="查找时间">
      <n-select v-model:value="value" :options="options" />
    </n-form-item>
    <n-form-item label="准确时间">
      <n-date-picker v-model:value="modelTime.value" type="datetime" clearable></n-date-picker>
    </n-form-item>
    <n-form-item>
      <n-button @click="handleSub()">提交</n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { NForm, NFormItem, NInput, NButton, NDatePicker, NSelect, NInputGroup } from 'naive-ui';
import { computed, ref, watchEffect } from 'vue';
import { TimeFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();
const value = ref<number | null>(null);
const modelTime = ref(new TimeFormDTO());
dayjs.extend(customParseFormat);
watchEffect(() => {
  modelTime.value.value = value.value;
});
const options = computed(() => {
  return clueStore.timeList.map((m) => {
    return {
      label: m.metadata,
      value: m.value as number,
      key: m.id,
    };
  });
});
// method
const search = () => {
  modelTime.value.value = +dayjs(modelTime.value.metadata, 'M月DD日，HH时mm分');
};
const handleSub = () => {
  clueStore.addTime(modelTime.value);
  window.$message.success('保存成功');
  const origin = modelTime.value.metadata;
  init();
  modelTime.value.metadata = origin;
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
