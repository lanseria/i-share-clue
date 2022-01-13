<template>
  <div class="subtitle-media-wrap">{{ subtitlesText }}</div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useTransfyStore } from '/@/store/modules/transfy';
export default defineComponent({
  setup() {
    const transfyStore = useTransfyStore();
    const subtitlesText = computed(() => {
      const idx = transfyStore.subtitles.findIndex((m) => m.id === transfyStore.waveId);
      if (idx >= 0) {
        return transfyStore.subtitles[idx].FinalSentence;
      } else {
        return '';
      }
    });
    return {
      subtitlesText,
    };
  },
});
</script>
<style lang="css" scoped>
.subtitle-media-wrap {
  position: absolute;
  transform: translate3d(-50%, -50%, 0px);
  left: 50%;
  bottom: 25%;
}
</style>
