<template>
  <n-layout>
    <n-layout-header style="padding: 24px">
      <n-page-header @back="handleBack">
        <template #title>
          {{ transfyDto.name }}
        </template>
        <template #subtitle>
          最近保存：
          <n-time :time="transfyDto.updatedAt" unix />
        </template>
        <template #avatar>
          <n-avatar :src="transfyDto.poster" />
        </template>
        <template #extra>
          <n-space>
            <n-button>导入字幕</n-button>
            <n-button @click="handleResplit()">重新分割</n-button>
            <n-button type="primary" @click="handleSave()">保存</n-button>
            <!-- <n-button type="primary" @click="handleExport()">导出下载</n-button> -->
          </n-space>
        </template>
        <template #footer>创建者：{{ transfyDto.creator.firstName + transfyDto.creator.lastName }}</template>
      </n-page-header>
    </n-layout-header>
    <n-layout style="height: 550px; margin: 24px" has-sider>
      <n-layout-sider width="666" content-style="padding: 24px;display: flex;align-items: center;">
        <video id="MediaRef" :src="transfyDto.url" controls style="width: 618px" @canplay="onCanplay"></video>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <subtitles-edit></subtitles-edit>
      </n-layout-content>
    </n-layout>
    <n-layout-footer>
      <wave-footer></wave-footer>
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { NPageHeader, NSpace, NButton, NAvatar, NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, NGrid, NGi, NTime, NCard } from 'naive-ui';
import SubtitlesEdit from '../components/subtitles-edit/index.vue';
import { TransfyDTO } from '/@/types/Admin/Transfy/dto';
import { getTransfyReq, resplitSubtitleReq } from '/@/api/Admin/TransfyAi/Transfy';
import { useImpRoute } from '/@/hooks/useRoute';
import { useTransfyStore } from '/@/store/modules/transfy';
import WaveFooter from '../components/wave/index.vue';
export default defineComponent({
  components: {
    NPageHeader,
    NSpace,
    NButton,
    NAvatar,
    NLayout,
    NLayoutContent,
    NLayoutFooter,
    NLayoutHeader,
    NLayoutSider,
    NGrid,
    NGi,
    NTime,
    NCard,
    SubtitlesEdit,
    WaveFooter,
  },
  setup() {
    const transfyStore = useTransfyStore();
    const { route, goBack } = useImpRoute();
    // ref
    const transfyDto = ref(new TransfyDTO());
    // computed
    const id = computed(() => {
      return route.params.id as string;
    });
    // events
    const onCanplay = (e: Event) => {
      document.querySelector('#MediaRef')?.setAttribute('controls', 'true');
      // const avHtml = document.querySelector('#MediaRef') as HTMLMediaElement;
      // transfyStore.setMediaElt(avHtml);
      transfyStore.$patch({
        videoLoaded: true,
      });
    };
    // method
    const handleResplit = async () => {
      const { payload } = await resplitSubtitleReq(id.value);
      if (payload) {
        loadPage();
      }
    };

    const handleSave = async () => {
      const res = await transfyStore.saveSubtitles();
      if (res) {
        window.$message.success('保存成功');
      } else {
        window.$message.error('保存失败');
      }
    };

    // const handleExport = () => {
    //   transfyStore.exportSubtitles();
    // };

    const handleBack = () => {
      goBack();
    };

    const loadPage = async () => {
      const { payload } = await getTransfyReq(id.value);
      transfyDto.value.mergeProperties(payload);
      transfyStore.setTransfy(transfyDto.value);
      await transfyStore.loadSubtitles();
    };
    // hook
    onMounted(() => {
      loadPage();
    });
    return {
      // refs
      // ref
      transfyDto,
      // event
      onCanplay,
      // method
      handleResplit,
      handleSave,
      // handleExport,
      handleBack,
    };
  },
});
</script>
