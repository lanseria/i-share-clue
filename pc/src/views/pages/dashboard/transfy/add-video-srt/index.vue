<template>
  <n-layout class="add-layout" content-style="padding: 36px 100px 0px; margin:0 auto; width: 1000px;">
    <n-layout-header style="background-color: initial; padding: 25px">
      <n-h3 prefix="bar">视频字幕</n-h3>
      <n-p>上传视频文件，AI将视频中的源语言转写成文字，可翻译成目标语言。支持多语种的转写与翻译。</n-p>
    </n-layout-header>
    <n-layout-content content-style="padding:25px;">
      <n-steps :current="current" :status="currentStatus">
        <n-step title="上传文件" description="上传需转写的视频文件" />
        <n-step title="等待翻译" description="等待AI翻译处理" />
        <n-step title="校对结果" description="对结果进行校对调整" />
        <n-step title="导出字幕" description="导出字幕/视频文件" />
      </n-steps>
      <n-divider />
      <n-form
        :model="model"
        ref="formRef"
        label-placement="left"
        :label-width="160"
        :style="{
          maxWidth: '640px',
          margin: '0 auto',
        }"
      >
        <n-form-item label="项目名称：" path="name">
          <n-input placeholder="请输入项目名称" v-model:value="model.name" />
        </n-form-item>
        <n-form-item label="上传文件：" path="url">
          <TransfyUploadVideo v-model:url="model.url"></TransfyUploadVideo>
        </n-form-item>
        <n-form-item label="视频源语言：" path="source">
          <n-input placeholder="请输入视频源语言" v-model:value="model.source" />
        </n-form-item>
        <n-form-item label="内容行业领域：" path="area">
          <n-input placeholder="请输入内容行业领域" v-model:value="model.area" />
        </n-form-item>
      </n-form>
    </n-layout-content>
    <n-layout-footer style="background-color: initial; text-align: center">
      <n-button size="large" type="primary" strong>提交</n-button>
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NP, NH3, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NDivider, NStep, NSteps, NForm, NFormItem, NInput, NButton } from 'naive-ui';
import TransfyUploadVideo from '/@/views/pages/transfy/UploadVideo/index.vue';
export default defineComponent({
  components: {
    NP,
    NH3,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NDivider,
    NStep,
    NSteps,
    NForm,
    NFormItem,
    NInput,
    NButton,
    TransfyUploadVideo,
  },
  setup() {
    const currentRef = ref<number | undefined>(1);
    const model = ref({
      name: '',
      url: '',
      source: '',
      area: '',
    });
    return {
      model,
      currentStatus: ref<'wait' | 'error' | 'finish' | 'process'>('process'),
      current: currentRef,
      next() {
        if (currentRef.value === undefined) currentRef.value = 1;
        else if (currentRef.value >= 4) currentRef.value = undefined;
        else currentRef.value++;
      },
      prev() {
        if (currentRef.value === 0) currentRef.value = undefined;
        else if (currentRef.value === undefined) currentRef.value = 4;
        else currentRef.value--;
      },
    };
  },
});
</script>
<style lang="css" scoped>
.add-layout {
}
</style>
