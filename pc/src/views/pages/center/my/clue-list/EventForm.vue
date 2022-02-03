<template>
  <n-form style="margin-top: 20px" label-placement="left" :model="modelEvent" ref="formRef">
    <n-form-item label="元数据">
      <n-input v-model:value="modelEvent.metadata"></n-input>
    </n-form-item>

    <n-form-item label="人物">
      <thing-select v-model:value="modelEvent.thing"></thing-select>
    </n-form-item>

    <n-form-item label="时间">
      <time-select v-model:value="modelEvent.time"></time-select>
    </n-form-item>

    <n-form-item label="地点">
      <place-select v-model:value="modelEvent.place"></place-select>
    </n-form-item>

    <n-form-item>
      <n-button @click="handleSub()">提交</n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NButton, NInput } from 'naive-ui';
import PlaceSelect from './PlaceSelect.vue';
import ThingSelect from './ThingSelect.vue';
import TimeSelect from './TimeSelect.vue';
import { ref } from 'vue';
import { EventFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();
const modelEvent = ref(new EventFormDTO());
// method
const handleSub = () => {
  clueStore.addEvent(modelEvent.value);
  window.$message.success('保存成功');
  init();
};
const init = () => {
  modelEvent.value = new EventFormDTO();
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
