<template>
  <div id="wave-timeline"></div>
  <div id="waveform"></div>
</template>
<script lang="ts">
import { RegionParams } from 'wavesurfer.js/src/plugin/regions';
import { defineComponent, onMounted, watchEffect, computed } from 'vue';
import { useTransfyStore } from '/@/store/modules/transfy';
import { useThemeVars } from 'naive-ui';
export default defineComponent({
  setup() {
    const transfyStore = useTransfyStore();
    const themeVars = useThemeVars();
    const regions = computed(() => {
      return transfyStore.subtitles.map((m) => {
        return {
          id: m.id,
          start: m.StartMs / 1000,
          end: m.EndMs / 1000,
          loop: false,
          color: 'hsla(400, 100%, 30%, 0.1)',
        } as unknown as RegionParams;
      });
    });
    onMounted(() => {
      watchEffect(() => {
        transfyStore.wavesurfer.setProgressColor(themeVars.value.infoColor);
        transfyStore.wavesurfer.setWaveColor(themeVars.value.primaryColor);
        if (transfyStore.wavesurferReady && transfyStore.subtitles.length) {
          transfyStore.wavesurfer.clearRegions();
          regions.value.forEach((opt) => {
            transfyStore.wavesurfer.addRegion(opt);
          });
        }
      });
    });
    transfyStore.$subscribe((mutation, state) => {
      // console.log(mutation);
      if (!state.wavesurferLoading && state.videoLoaded && !state.wavesurferReady) {
        console.log('wavesurfer loading');
        transfyStore.$patch({
          wavesurferLoading: true,
        });
      }
    });

    return {
      regions,
    };
  },
});
</script>
<style lang="css">
#waveform {
  position: relative;
  opacity: 0.5;
}
#waveform > wave > wave > canvas {
  top: 50% !important;
}
#waveform > wave > canvas {
  top: 50% !important;
}
#waveform > wave::-webkit-scrollbar {
  display: none;
}
</style>
