<template>
  <div></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useImpRoute } from '/@/hooks/useRoute';
import { useUserStore } from '/@/store/modules/user';
const { crtName, crtFullpath, replaceFullpath } = useImpRoute();
const userStore = useUserStore();
onMounted(() => {
  if (userStore.userLogin) {
    console.log(crtName.value);
    console.log(crtFullpath.value);
    console.log('mounted');
    replaceFullpath(crtFullpath.value);
  } else {
    replaceFullpath('/login');
  }
});
</script>
