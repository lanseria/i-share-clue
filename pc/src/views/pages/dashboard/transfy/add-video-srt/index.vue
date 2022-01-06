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
        <n-form-item label="语言引擎模型：" path="engineModelType">
          <n-select v-model:value="model.engineModelType" :options="engineModelTypeOpts" placeholder="请输入视频源语言" />
        </n-form-item>
      </n-form>
    </n-layout-content>
    <n-layout-footer style="background-color: initial; text-align: center">
      <n-button size="large" type="primary" strong style="width: 200px">提交</n-button>
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { NP, NH3, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NDivider, NStep, NSteps, NForm, NFormItem, NInput, NButton, NSelect } from 'naive-ui';
import TransfyUploadVideo from '/@/views/pages/transfy/UploadVideo/index.vue';
import { EngineModel, EngineModelKeyType, TransfyFormDTO } from '/@/types/Admin/Transfy/dto';
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
    NSelect,
    TransfyUploadVideo,
  },
  setup() {
    const currentRef = ref<number | undefined>(1);
    const model = ref(new TransfyFormDTO());
    const engineModelTypeOpts = computed(() => {
      const options = [];
      for (const key in EngineModel) {
        if (Object.prototype.hasOwnProperty.call(EngineModel, key)) {
          const element = EngineModel[key as EngineModelKeyType];
          options.push({
            label: element,
            value: key,
          });
        }
      }
      return options;
    });
    return {
      model,
      currentStatus: ref<'wait' | 'error' | 'finish' | 'process'>('process'),
      current: currentRef,
      engineModelTypeOpts,
      // method
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
