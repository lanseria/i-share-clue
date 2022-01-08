<template>
  <n-layout>
    <n-layout-header style="padding: 24px">
      <n-page-header @back="handleBack">
        <template #title>
          <a href="https://anyway.fm/" style="text-decoration: none; color: inherit">{{ transfyDto.name }}</a>
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
    <n-layout has-sider>
      <n-layout-sider width="666" content-style="padding: 24px;">
        <video :src="`//${transfyDto.url}`" controls style="width: 618px; height: 309px"></video>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">平山道</n-layout-content>
    </n-layout>
    <n-layout-footer>成府路</n-layout-footer>
  </n-layout>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { NPageHeader, NSpace, NButton, NAvatar, NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, NGrid, NGi, NTime } from 'naive-ui';
import { TransfyDTO } from '/@/types/Admin/Transfy/dto';
import { getTransfyReq } from '/@/api/Admin/TransfyAi/Transfy';
import { useImpRoute } from '/@/hooks/useRoute';
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
  },
  setup() {
    const { route, goBack } = useImpRoute();
    const transfyDto = ref(new TransfyDTO());
    const id = computed(() => {
      return route.params.id as string;
    });
    const loadPage = async () => {
      const { payload } = await getTransfyReq(id.value);
      transfyDto.value.mergeProperties(payload);
    };
    onMounted(() => {
      loadPage();
    });
    return {
      // ref
      transfyDto,
      // method
      handleBack() {
        goBack();
      },
    };
  },
});
</script>
