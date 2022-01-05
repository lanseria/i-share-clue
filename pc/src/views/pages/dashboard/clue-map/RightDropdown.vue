<template>
  <n-dropdown
    placement="bottom-start"
    @select="handleSelect"
    trigger="manual"
    :x="x"
    :y="y"
    :options="ddOptions"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
  />
</template>
<script lang="ts">
import { NDropdown, useMessage } from 'naive-ui';
import { defineComponent, ref } from 'vue';
// global
const ddOptions = [
  {
    label: '添加信息',
    key: 'add-msg',
  },
];
export default defineComponent({
  components: {
    NDropdown,
  },
  emits: ['add-msg'],
  setup(props, { emit }) {
    const message = useMessage();
    // ref
    const xRef = ref(0);
    const yRef = ref(0);
    const showDropdownRef = ref(false);
    const onClickoutside = (e: MouseEvent) => {
      showDropdownRef.value = false;
    };
    const open = (e: any) => {
      xRef.value = e.originEvent.clientX;
      yRef.value = e.originEvent.clientY;
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
    return {
      showDropdown: showDropdownRef,
      ddOptions,
      x: xRef,
      y: yRef,
      open,
      close,
      handleSelect,
      onClickoutside,
    };
  },
});
</script>
