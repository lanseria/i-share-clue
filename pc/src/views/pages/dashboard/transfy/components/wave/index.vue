<template>
  <div id="waveform"></div>
</template>
<script lang="ts">
import WaveSurfer from 'wavesurfer.js';
import { defineComponent, onMounted, watchEffect } from 'vue';
import { useTransfyStore } from '/@/store/modules/transfy';
export default defineComponent({
  setup() {
    let wavesurfer: WaveSurfer;
    const transfyStore = useTransfyStore();
    onMounted(() => {
      wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        barGap: 3,
        barRadius: 2,
        barWidth: 5,
        scrollParent: true,
        responsive: true,
      });
    });
    watchEffect(() => {
      if (transfyStore.loaded && wavesurfer) {
        wavesurfer.load(transfyStore.transfy.url);
      }
    });
    return {};
  },
});
</script>
