<template>
  <n-scrollbar style="max-height: 400px">
    <n-form>
      <n-form-item label="ffmpeg 命令">
        <n-card>
          <n-code :code="code" language="shell" inline />
        </n-card>
      </n-form-item>
      <n-form-item label="字幕文件内容">
        <div>
          <n-radio-group v-model:value="value" name="radiogroup">
            <n-space>
              <n-radio v-for="item in types" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>
        <n-scrollbar style="max-height: 200px">
          <n-input
            :value="valueString"
            type="textarea"
            placeholder="字幕文件内容"
            :autosize="{
              minRows: 3,
            }"
            disabled
          />
        </n-scrollbar>
      </n-form-item>
    </n-form>
  </n-scrollbar>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { NCode, NInput, NScrollbar, NForm, NFormItem, NCard, NRadio, NRadioGroup, NSpace } from 'naive-ui';
import { useTransfyStore } from '/@/store/modules/transfy';
import { buildFile, srt2webvtt } from '/@/utils/transfy';
export default defineComponent({
  components: {
    NCode,
    NInput,
    NScrollbar,
    NForm,
    NFormItem,
    NCard,
    NRadio,
    NRadioGroup,
    NSpace,
  },
  setup() {
    const transfyStore = useTransfyStore();
    const value = ref('srt');
    const valueString = computed(() => {
      const srtContent = buildFile(transfyStore.subtitles);
      if (value.value === 'webvtt') {
        return srt2webvtt(srtContent);
      }
      return buildFile(transfyStore.subtitles);
    });
    return {
      value,
      valueString,
      code: '$ ffmpeg -i test_1280x720_3.mkv -vf subtitles=test_1280x720_3.srt out.mp4',
      types: [
        {
          value: 'srt',
          label: '.SRT',
        },
        {
          value: 'webvtt',
          label: '.WebVtt',
        },
      ],
    };
  },
});
</script>
