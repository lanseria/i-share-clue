<template>
  <n-modal preset="card" :style="bodyStyle" :title="title" v-model:show="showModal" :on-after-leave="handleLeave">
    <template #header-extra>
      <slot name="header-extra"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NModal } from 'naive-ui';
export default defineComponent({
  name: 'ImpModal',
  props: {
    title: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 600,
    },
  },
  emits: ['leave'],
  components: {
    NModal,
  },
  setup(props, { emit }) {
    const showModal = ref(false);
    const handleLeave = () => {
      emit('leave');
    };
    return {
      bodyStyle: {
        width: `${props.width}px`,
      },
      showModal,
      handleLeave,
    };
  },
});
</script>
