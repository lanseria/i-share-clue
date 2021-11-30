<template>
  <imp-page-container>
    <div class="data-table-header">
      <n-space align="center">
        <n-button type="primary" @click="handleAdd()">新增</n-button>
      </n-space>
      <n-space>
        <n-input-group>
          <n-input v-model:value="searchName" clearable>
            <template #prefix>
              <n-icon>
                <search-outline-icon />
              </n-icon>
            </template>
          </n-input>
          <n-button type="primary" ghost @click="handleSearch()">搜索</n-button>
        </n-input-group>
      </n-space>
    </div>
    <n-data-table
      remote
      :loading="loading"
      :columns="columns"
      :data="pagedTable"
      :pagination="pagination"
      :row-key="(row) => row.id"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @update:checked-row-keys="handleCheck"
    />
  </imp-page-container>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts">
import { NDataTable, NButton, NSpace, NInputGroup, NInput, NIcon, NTag, NSwitch } from 'naive-ui';
import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { deleteDictReq, getDictPageReq } from '/@/api/Admin/Access/Dict';
import { useImpDataTable } from '/@/hooks/useDataTable';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import FormModal from './FormModal.vue';
export default defineComponent({
  components: {
    NDataTable,
    NButton,
    NSpace,
    NInputGroup,
    NInput,
    NIcon,
    NTag,
    NSwitch,
    SearchOutlineIcon,
    FormModal,
  },
  setup() {
    // refs
    const FormModalRef = ref();
    const cols: TableColumn[] = [
      {
        type: 'selection',
      },
      {
        title: '字典名',
        key: 'name',
      },
      {
        title: '字典值',
        key: 'value',
      },
    ];
    const searchName = ref('');
    const handleAdd = () => {
      FormModalRef.value.open();
    };
    const handleEdit = (row: IObj) => {
      FormModalRef.value.open(row);
    };
    const handleDel = (row: IObj) => {
      const actionName = row ? '删除' : '删除';
      const actionMethod = deleteDictReq;
      window.$dialog.error({
        title: '注意',
        content: `你确定${actionName}此字典？`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          await actionMethod([row.id]);
          loadPage();
        },
        onNegativeClick: () => {
          loadPage();
        },
      });
    }; // computed
    const currentQuery = computed(() => {
      return {
        name: searchName.value,
      };
    });
    const operateOptions = [
      {
        name: '编辑',
        func: handleEdit,
      },
      {
        name: '删除',
        func: handleDel,
      },
    ];
    const {
      loading,
      columns,
      pagedTable,
      pagination,
      //
      handlePageChange,
      handlePageSizeChange,
      handleCheck,
      initPage,
      loadPage,
    } = useImpDataTable({
      cols,
      operateOptions,
      pageReq: getDictPageReq,
      currentQuery,
    });
    const handleSearch = () => {
      initPage();
    };
    onMounted(() => {
      loadPage();
    });
    return {
      // refs
      FormModalRef,
      // ref
      searchName,
      loading,
      columns,
      pagedTable,
      pagination,
      //
      handlePageChange,
      handlePageSizeChange,
      handleCheck,
      handleAdd,
      loadPage,
      handleSearch,
    };
  },
});
</script>

<style lang="css" scoped>
.data-table-header {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
