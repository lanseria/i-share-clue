<template>
  <n-list>
    <n-list-item v-for="(item, i) in subtitles" :key="i">
      <template #prefix>
        <SrtTimestamp v-model:timestamp="item.StartMs"></SrtTimestamp>
        <SrtTimestamp v-model:timestamp="item.EndMs"></SrtTimestamp>
      </template>
      <template #suffix>
        <n-grid x-gap="10" :cols="2" style="margin-right: 15px; width: 40px">
          <n-gi>
            <n-button text style="font-size: 14px">
              <n-icon>
                <git-merge-outline-icon />
              </n-icon>
            </n-button>
          </n-gi>
          <n-gi>
            <n-button text style="font-size: 14px">
              <n-icon>
                <add-outline-icon />
              </n-icon>
            </n-button>
          </n-gi>
          <n-gi>
            <n-button text style="font-size: 14px">
              <n-icon>
                <git-pull-request-outline-icon />
              </n-icon>
            </n-button>
          </n-gi>
          <n-gi>
            <n-button text style="font-size: 14px">
              <n-icon>
                <trash-sharp-icon />
              </n-icon>
            </n-button>
          </n-gi>
        </n-grid>
      </template>
      {{ item.FinalSentence }}
    </n-list-item>
  </n-list>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NList, NListItem, NButton, NGrid, NIcon, NGi } from 'naive-ui';
import SrtTimestamp from '../srt-timestamp/index.vue';

import {
  AddOutline as AddOutlineIcon,
  TrashSharp as TrashSharpIcon,
  GitMergeOutline as GitMergeOutlineIcon,
  GitPullRequestOutline as GitPullRequestOutlineIcon,
} from '@vicons/ionicons5';
import { SliceItem } from '/@/global-enums/subtitles.enum';
export default defineComponent({
  components: {
    NList,
    NListItem,
    NGrid,
    NGi,
    NButton,
    NIcon,
    AddOutlineIcon,
    TrashSharpIcon,
    GitMergeOutlineIcon,
    GitPullRequestOutlineIcon,
    SrtTimestamp,
  },
  setup() {
    const subtitles = ref<SliceItem[]>([]);
    const setValue = (value: SliceItem[]) => {
      subtitles.value = value;
    };
    return {
      subtitles,
      // method
      setValue,
    };
  },
});
</script>
