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
import { ref } from 'vue';
// global
const ddOptions = [
  {
    label: '添加信息',
    key: 'add-msg',
  },
  {
    label: '手动刷新',
    key: 'refresh',
  },
];
const emit = defineEmits(['add-msg', 'add-area', 'refresh']);
const message = useMessage();
// ref
const x = ref(0);
const y = ref(0);
const showDropdownRef = ref(false);
const onClickoutside = (e: MouseEvent) => {
  showDropdownRef.value = false;
};
const open = (e: MouseEvent) => {
  x.value = e.clientX;
  y.value = e.clientY;
  showDropdownRef.value = true;
};
const close = () => {
  showDropdownRef.value = false;
};
const handleSelect = (key: string) => {
  showDropdownRef.value = false;
  if (key === 'add-msg') {
    emit('add-msg');
  }
  if (key === 'add-area') {
    emit('add-area');
  }
  if (key === 'refresh') {
    emit('refresh');
  }
};
defineExpose({
  open,
  close,
});
</script>
