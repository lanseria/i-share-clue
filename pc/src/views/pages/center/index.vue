<template>
  <div>加载中</div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useImpRoute } from '/@/hooks/useRoute';
import { useUserStore } from '/@/store/modules/user';
const { replacePath } = useImpRoute();
onMounted(() => {
  const userStore = useUserStore();
  const enableWorkbenchList = userStore.enableWorkbenchList;
  if (enableWorkbenchList.length) {
    replacePath('/workbench');
  } else {
    replacePath('/center/my');
  }
});
</script>
