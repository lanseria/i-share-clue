<template>
  <n-dropdown
    placement="bottom-start"
    @select="handleSelect"
    trigger="manual"
    :x="x"
    :y="y"
    :options="ddOptions"
    :show="showDropdownRef"
    :on-clickoutside="onClickoutside"
  />
</template>
<script lang="ts" setup>
import { NDropdown, useMessage } from 'naive-ui';
import { defineComponent, ref } from 'vue';
// global
const ddOptions = [
  {
    label: '添加信息',
    key: 'add-msg',
  },
];
const emit = defineEmits(['add-msg']);
const message = useMessage();
// ref
const x = ref(0);
const y = ref(0);
const showDropdownRef = ref(false);
const onClickoutside = (e: MouseEvent) => {
  showDropdownRef.value = false;
};
const open = (e: any) => {
  x.value = e.originEvent.clientX;
  y.value = e.originEvent.clientY;
  showDropdownRef.value = true;
};
const close = () => {
  showDropdownRef.value = false;
};
const handleSelect = (key: string) => {
  showDropdownRef.value = false;
  message.info(key);
  if (key === 'add-msg') {
    emit('add-msg');
  }
};
defineExpose({
  open,
  close,
});
</script>
