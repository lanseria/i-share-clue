<template>
  <n-tabs type="segment">
    <n-tab-pane name="chap1" tab="字幕编辑" display-directive="show:lazy">
      <n-scrollbar style="max-height: 450px">
        <edit ref="EditRef"></edit>
      </n-scrollbar>
    </n-tab-pane>
    <n-tab-pane name="chap2" tab="字幕样式" display-directive="show:lazy">
      “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的 Amazon 服务，还是救公寓的火。
      <br />
      <br />
      我的脑海中忽然出现了 Amazon 著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始 debug
      这个线上问题。
    </n-tab-pane>
  </n-tabs>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NTabs, NTabPane, NScrollbar, NButton, NIcon } from 'naive-ui';
import { SliceItem } from '/@/global-enums/subtitles.enum';
import Edit from '../edit/index.vue';
export default defineComponent({
  components: {
    NTabs,
    NTabPane,
    NScrollbar,
    NButton,
    NIcon,
    Edit,
  },
  setup(props, { emit }) {
    const EditRef = ref();

    const setSubtitlesValue = (subtitles: SliceItem[]) => {
      EditRef.value.setValue(subtitles);
    };
    return {
      // refs
      EditRef,
      // method
      setSubtitlesValue,
    };
  },
});
</script>
