<template>
  <imp-page-container :showHeader="false">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <div class="light-green grid-box">
          <n-h3 prefix="bar">原始线索</n-h3>
          <n-grid x-gap="12" y-gap="10" :cols="4">
            <n-gi>
              <n-card title="添加线索" hoverable embedded :bordered="false" v-advance-click="handleAddClue">添加原始线索进行纠错与分词</n-card>
            </n-gi>
            <n-gi v-for="item in rawClueList" :key="item.id">
              <n-card
                :title="item.name"
                hoverable
                embedded
                :bordered="false"
                closable
                @close="
                  () => {
                    handleClose(item);
                  }
                "
              >
                <template #header-extra>
                  <n-button
                    text
                    @click="
                      () => {
                        handleReset(item);
                      }
                    "
                  >
                    重置
                  </n-button>
                </template>
                <n-ellipsis :tooltip="false">
                  {{ item.metadata }}
                </n-ellipsis>
                <template #action>
                  <n-space>
                    <n-button
                      text
                      @click="
                        () => {
                          handleCorrect(item);
                        }
                      "
                    >
                      数据纠正
                    </n-button>
                    <n-button
                      text
                      @click="
                        () => {
                          handleSplit(item);
                        }
                      "
                    >
                      数据分词
                    </n-button>
                  </n-space>
                </template>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </n-gi>
      <n-gi>
        <div class="green grid-box">
          <n-h3 prefix="bar" type="info">找到的线索</n-h3>
          <n-tabs type="line">
            <n-tab-pane name="person" tab="人物">人物</n-tab-pane>
            <n-tab-pane name="place" tab="地点">地点</n-tab-pane>
            <n-tab-pane name="time" tab="时间">时间</n-tab-pane>
            <n-tab-pane name="event" tab="事件">事件</n-tab-pane>
          </n-tabs>
        </div>
      </n-gi>
    </n-grid>
  </imp-page-container>
  <clue-modal ref="ClueModalRef" @load-page="loadPage()"></clue-modal>
  <correct-modal ref="CorrectModalRef" @load-page="loadPage()"></correct-modal>
  <split-modal ref="SplitModalRef" @load-page="loadPage()"></split-modal>
</template>
<script lang="ts" setup>
import { NGi, NGrid, NCard, NH3, NTabs, NTabPane, NEllipsis, NButton, NSpace } from 'naive-ui';
import { computed, ref } from 'vue';
import ClueModal from './ClueModal.vue';
import CorrectModal from './CorrectModal.vue';
import SplitModal from './SplitModal.vue';
import { splitArticleReq } from '/@/api/Server/jieba';
import { RawClueFormDTO, useClueStore } from '/@/store/modules/clue';
const clueStore = useClueStore();

const ClueModalRef = ref();
const CorrectModalRef = ref();
const SplitModalRef = ref();
const rawClueList = computed(() => {
  return clueStore.rawClueList;
});
const handleAddClue = () => {
  ClueModalRef.value.open();
};
const handleCorrect = (row: RawClueFormDTO) => {
  CorrectModalRef.value.correct(row);
};
const handleSplit = async (row: RawClueFormDTO) => {
  if (!row.splitdata.length) {
    const { data } = await splitArticleReq(row.correctdata);
    row.splitdata = data;
    clueStore.addRawClue(row);
  }
  SplitModalRef.value.split(row);
};
const handleReset = (row: RawClueFormDTO) => {
  row = new RawClueFormDTO(row);
  row.initData();
  clueStore.addRawClue(row);
};
const handleClose = (row: RawClueFormDTO) => {
  window.$dialog.warning({
    title: '警告',
    content: '你确定删除该原始线索？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      clueStore.delRawCLue(row);
      window.$message.success('删除成功');
    },
    onNegativeClick: () => {
      //
    },
  });
};
const loadPage = () => {
  //
};
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
