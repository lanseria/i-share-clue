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
            <n-button>保存</n-button>
            <n-button type="primary">导出下载</n-button>
          </n-space>
        </template>
        <template #footer>创建者：{{ transfyDto.creator.firstName + transfyDto.creator.lastName }}</template>
      </n-page-header>
    </n-layout-header>
    <n-layout style="height: 550px; margin: 24px" has-sider>
      <n-layout-sider width="666" content-style="padding: 24px;display: flex;align-items: center;">
        <video :src="transfyDto.url" controls style="width: 618px"></video>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <SubtitlesEdit ref="SubtitlesEditRef"></SubtitlesEdit>
      </n-layout-content>
    </n-layout>
    <n-layout-footer>成府路</n-layout-footer>
  </n-layout>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { NPageHeader, NSpace, NButton, NAvatar, NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, NGrid, NGi, NTime } from 'naive-ui';
import SubtitlesEdit from '../components/subtitles-edit/index.vue';
import { TransfyDTO } from '/@/types/Admin/Transfy/dto';
import { getSubtitlesReq, getTransfyReq } from '/@/api/Admin/TransfyAi/Transfy';
import { useImpRoute } from '/@/hooks/useRoute';
import { SliceItem } from '/@/global-enums/subtitles.enum';
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
    SubtitlesEdit,
  },
  setup() {
    const SubtitlesEditRef = ref();
    const { route, goBack } = useImpRoute();
    const transfyDto = ref(new TransfyDTO());
    const subtitlesList = ref<SliceItem[]>([]);
    const id = computed(() => {
      return route.params.id as string;
    });
    const loadPage = async () => {
      const { payload } = await getTransfyReq(id.value);
      transfyDto.value.mergeProperties(payload);
      const res = await getSubtitlesReq(transfyDto.value.recResJsonUrl);
      subtitlesList.value = res;
      SubtitlesEditRef.value.setSubtitlesValue(subtitlesList.value);
    };
    onMounted(() => {
      loadPage();
    });
    return {
      // refs
      SubtitlesEditRef,
      // ref
      transfyDto,
      subtitlesList,
      // method
      handleBack() {
        goBack();
      },
    };
  },
});
</script>
