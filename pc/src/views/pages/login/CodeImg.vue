<template>
  <img :src="codeSrc" alt="验证码" @click="refreshCode" />
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useAppStore } from '/@/store/modules/app';
import { randomLenNum } from '/@/utils/random';
const emit = defineEmits<{
  (e: 'refresh', value: string): void;
}>();
// use
const appStore = useAppStore();
// ref
const codeSrc = ref('');
const randomStr = ref('');
// computed
const invertValue = computed(() => {
  return appStore.getTheme === 'dark' ? 0.84 : 0;
});
// methods
const refreshCode = () => {
  randomStr.value = randomLenNum();
  codeSrc.value = `/api/code?randomStr=${randomStr.value}`;
  emit('refresh', randomStr.value);
};
onMounted(() => {
  refreshCode();
});
defineExpose({
  refreshCode,
});
</script>
<style lang="css" scoped>
img {
  height: 30px;
  cursor: pointer;
  filter: invert(v-bind(invertValue));
}
</style>
