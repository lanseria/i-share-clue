<template>
  <imp-modal ref="ImpModalRef" :title="`${actionProp.actionName}字典`" @leave="close()">
    <n-form :model="modelRef" ref="formRef">
      <n-form-item path="name" label="字典名">
        <n-input v-model:value="modelRef.name" />
      </n-form-item>
      <n-form-item path="value" label="字典值">
        <n-input v-model:value="modelRef.value" />
      </n-form-item>
      <n-form-item path="value" label="父字典">
        <n-tree-select :options="dictTreeOptions" v-model:value="modelRef.parentId" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space>
        <n-button type="primary" @click="onSubmit()">保存</n-button>
        <n-button @click="close()">返回</n-button>
      </n-space>
    </template>
  </imp-modal>
</template>
<script lang="ts">
import { NForm, NFormItem, NInput, NSpace, NButton, NTreeSelect, TreeSelectOption } from 'naive-ui';
import { computed, defineComponent, ref } from 'vue';
import { createDictReq, getDictTreeReq, updateDictReq } from '/@/api/Admin/Access/Dict';
import { DictDTO } from '/@/types/Admin/Dict/dto';
export default defineComponent({
  emits: ['load-page', 'update:dictTreeOptions'],
  components: {
    NForm,
    NFormItem,
    NInput,
    NSpace,
    NButton,
    NTreeSelect,
  },
  setup(props, { emit }) {
    // refs
    const ImpModalRef = ref();
    const isEdit = ref(false);
    // ref
    const modelRef = ref(new DictDTO());
    const dictTreeOptions = ref<TreeSelectOption[]>([]);
    const actionProp = computed(() => {
      if (isEdit.value) {
        return {
          actionName: '编辑',
          actionMethod: updateDictReq,
        };
      } else {
        return {
          actionName: '创建',
          actionMethod: createDictReq,
        };
      }
    });
    // method
    const loadOptions = async () => {
      const { payload } = await getDictTreeReq();
      dictTreeOptions.value = payload;
      emit('update:dictTreeOptions', payload);
    };
    const open = (row?: IObj, pRow?: IObj) => {
      if (row) {
        isEdit.value = true;
        modelRef.value.mergeProperties(row);
      } else {
        modelRef.value.mergeProperties(pRow);
        isEdit.value = false;
      }
      ImpModalRef.value.showModal = true;
      loadOptions();
    };
    const close = () => {
      modelRef.value = new DictDTO();
      ImpModalRef.value.showModal = false;
      loadOptions();
      emit('load-page');
    };
    const onSubmit = async () => {
      const { errorType } = await actionProp.value.actionMethod(modelRef.value);
      console.log(errorType);
      if (!errorType) {
        window.$message.success('操作成功');
        close();
      }
    };
    return {
      // refs
      ImpModalRef,
      // ref
      modelRef,
      isEdit,
      dictTreeOptions,
      // computed
      actionProp,
      // method
      open,
      close,
      onSubmit,
    };
  },
});
</script>
