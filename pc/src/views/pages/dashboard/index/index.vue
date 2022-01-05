<template>
  <n-empty description="是一个飞机">
    <template #icon>
      <n-icon>
        <AirplaneIcon />
      </n-icon>
    </template>
    <template #extra>
      <n-button size="small">看看别的</n-button>
    </template>
  </n-empty>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { NEmpty, NIcon, NButton } from 'naive-ui';
import { Airplane as AirplaneIcon } from '@vicons/ionicons5';
export default defineComponent({
  components: {
    NEmpty,
    NIcon,
    NButton,
    AirplaneIcon,
  },
  setup() {
    return {};
  },
});
</script>
