<template>
  <imp-modal ref="ImpModalRef" :width="800" title="数据分词">
    <n-grid x-gap="12" :cols="2">
      <n-gi path="splitdata" label="数据分词">
        <n-scrollbar style="max-height: 500px" @contextmenu="handleContextMenu">
          <n-el tag="p">
            <span :class="dotType(item.flag)" :title="item.flag" v-for="(item, idx) in modelRef.splitdata" :key="idx">{{ item.word }}</span>
          </n-el>
        </n-scrollbar>
        <n-dropdown
          placement="bottom-start"
          @select="handleSelect"
          trigger="manual"
          :x="dropdown.x"
          :y="dropdown.y"
          :options="dropdown.options"
          :show="dropdown.showDropdown"
          :on-clickoutside="onClickoutside"
        />
      </n-gi>
      <n-gi path="correctdata" label="数据分词">
        <n-select v-model:value="value" :options="options" />

        <thing-form v-show="value === 'thing'" ref="ThingFormRef"></thing-form>
        <place-form v-show="value === 'place'" ref="PlaceFormRef"></place-form>
        <time-form v-show="value === 'time'" ref="TimeFormRef"></time-form>
        <!-- <template v-if="value === 'event'"></template> -->
      </n-gi>
    </n-grid>
    <template #footer>
      <n-space>
        <n-button type="primary" @click="save()">保存</n-button>
        <n-button @click="close()">返回</n-button>
      </n-space>
    </template>
  </imp-modal>
</template>
<script lang="ts" setup>
import { NSpace, NButton, NEl, NScrollbar, NDropdown, NGrid, NGi, NSelect } from 'naive-ui';
import { nextTick, reactive, ref, watchEffect } from 'vue';
import { RawClueFormDTO, useClueStore } from '/@/store/modules/clue';
import ThingForm from './ThingForm.vue';
import PlaceForm from './PlaceForm.vue';
import TimeForm from './TimeForm.vue';
const emit = defineEmits(['load-page']);
const clueStore = useClueStore();
// refs
const ImpModalRef = ref();
// ref
const value = ref('thing');
const options = [
  {
    label: '人物',
    value: 'thing',
  },
  {
    label: '地点',
    value: 'place',
  },
  {
    label: '时间',
    value: 'time',
  },
  {
    label: '事件',
    value: 'event',
  },
];
const dropdown = reactive({
  showDropdown: false,
  x: 0,
  y: 0,
  options: [
    {
      label: '合并为地点',
      key: 'place',
    },
    {
      label: '合并为人物',
      key: 'thing',
    },
    {
      label: '合并为时间',
      key: 'time',
    },
  ],
});
// ref
const modelRef = ref(new RawClueFormDTO());
const ThingFormRef = ref();
const PlaceFormRef = ref();
const TimeFormRef = ref();
watchEffect(() => {
  if (ThingFormRef.value || PlaceFormRef.value) {
    if (value.value === 'thing') {
      ThingFormRef.value.init();
    }
    if (value.value === 'place') {
      PlaceFormRef.value.init();
    }
    if (value.value === 'time') {
      TimeFormRef.value.init();
    }
  }
});
// methods
const dotType = (flag: string) => {
  if (flag === 'ns' || flag === 'LOC' || flag === 'nt') {
    return 'success';
  } else if (flag === 'TIME') {
    return 'warning';
  } else if (flag === 'nr' || flag === 'PER') {
    return 'info';
  } else {
    return '';
  }
};
const split = (row: IObj) => {
  modelRef.value.mergeProperties(row);
  ImpModalRef.value.showModal = true;
};
const save = () => {
  const isNew = clueStore.rawClueList.findIndex((m) => modelRef.value.id === m.id) < 0;
  if (isNew) {
    modelRef.value.initData();
  }
  clueStore.addRawClue(modelRef.value);
  window.$message.success('保存成功');
  close();
};
const close = () => {
  modelRef.value = new RawClueFormDTO();
  ImpModalRef.value.showModal = false;
  emit('load-page');
};
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  dropdown.showDropdown = false;
  nextTick().then(() => {
    dropdown.showDropdown = true;
    dropdown.x = e.clientX;
    dropdown.y = e.clientY;
  });
};
const handleSelect = (key: string) => {
  dropdown.showDropdown = false;
  const selection = document.getSelection();
  const selectionText = selection?.toString();
  console.log(selection);
  window.$message.info(key);
  window.$message.info(selectionText || 'nothing');
};
const onClickoutside = (e: MouseEvent) => {
  window.$message.info('clickoutside');
  dropdown.showDropdown = false;
};
defineExpose({
  split,
  close,
});
</script>
<style lang="css" scoped>
span.success {
  color: var(--success-color);
}
span.info {
  color: var(--info-color);
}
span.warning {
  color: var(--warning-color);
}
</style>
