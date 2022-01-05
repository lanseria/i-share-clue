<template>
  <imp-page-container :showHeader="false">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <div class="light-green grid-box">
          <n-h3 prefix="bar">添加任务</n-h3>
          <n-grid x-gap="12" :cols="4">
            <n-gi>
              <n-card title="视频字幕" hoverable embedded :bordered="false" @click="handleAddVideoSrt()">视频语音转文字，可进行翻译，生成字幕</n-card>
            </n-gi>
            <n-gi>
              <n-card title="音频字幕" hoverable embedded :bordered="false">音频语音转文字，可进行翻译，生成字幕</n-card>
            </n-gi>
            <n-gi>
              <n-card title="字幕翻译" hoverable embedded :bordered="false">AI智能翻译，支持多语种字幕文件</n-card>
            </n-gi>
          </n-grid>
        </div>
      </n-gi>
      <n-gi>
        <div class="green grid-box">
          <n-h3 prefix="bar" type="info">我的任务</n-h3>
          <n-empty description="你什么也找不到">
            <template #extra>
              <n-button>看看别的</n-button>
            </template>
          </n-empty>
        </div>
      </n-gi>
    </n-grid>
  </imp-page-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { NGrid, NGi, NH3, NCard, NEmpty, NButton } from 'naive-ui';
import { useImpRoute } from '/@/hooks/useRoute';
export default defineComponent({
  components: {
    NGrid,
    NGi,
    NH3,
    NCard,
    NEmpty,
    NButton,
  },
  setup() {
    const { pushPath } = useImpRoute();
    const handleAddVideoSrt = () => {
      pushPath('/dashboard/add-video-srt');
    };
    return {
      handleAddVideoSrt,
    };
  },
});
</script>
<style lang="css" scoped>
.grid-box {
  padding: 25px;
}
.light-green {
  background-color: rgba(131, 131, 131, 0.2);
}
.green {
  background-color: rgba(131, 131, 131, 0.1);
}
</style>
