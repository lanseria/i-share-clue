<template>
  <imp-page-container :showHeader="false">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <div class="light-green grid-box">
          <n-h3 prefix="bar">添加任务</n-h3>
          <n-grid x-gap="12" :cols="4">
            <n-gi>
              <n-card title="单音视频下载" hoverable embedded :bordered="false" v-advance-click="handleDownload">快速下载单个音视频</n-card>
            </n-gi>
            <n-gi>
              <n-card title="批量音视频下载" hoverable embedded :bordered="false">编辑多个音视频链接进行下载</n-card>
            </n-gi>
            <n-gi>
              <n-card title="代理配置" hoverable embedded :bordered="false">使用字典进行配置代理</n-card>
            </n-gi>
          </n-grid>
        </div>
      </n-gi>
    </n-grid>
  </imp-page-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { NGi, NGrid, NCard, NH3 } from 'naive-ui';
export default defineComponent({
  components: {
    NGi,
    NGrid,
    NCard,
    NH3,
  },
  setup() {
    const handleDownload = () => {
      //
    };
    return {
      handleDownload,
    };
  },
});
</script>
<style lang="css" scoped>
.grid-box {
  padding: 25px;
}
.light-green {
  background-color: rgba(131, 131, 131, 0.1);
}
.green {
  background-color: rgba(131, 131, 131, 0);
}
</style>
