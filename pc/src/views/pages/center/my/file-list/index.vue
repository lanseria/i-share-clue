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
    <n-alert v-if="checkedRowKeysRef.length" :show-icon="false" style="margin-bottom: 10px" type="info">
      <template #header></template>
      <n-space justify="space-between" align="center">
        <div>已选中 {{ checkedRowKeysRef.length }} 项</div>
        <n-button tertiary type="error" @click="handleDel()">删除文档</n-button>
      </n-space>
    </n-alert>
    <n-data-table
      remote
      :loading="loading"
      :columns="columns"
      :data="pagedTable"
      :pagination="pagination"
      :row-key="(row) => row.name"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @update:checked-row-keys="handleCheck"
      @update:sorter="handleSorterChange"
    />
  </imp-page-container>
  <FileUploadModal ref="FileUploadModalRef" @leave="loadPage()"></FileUploadModal>
</template>
<script lang="ts">
import { NDataTable, NButton, NSpace, NInputGroup, NInput, NIcon, NTag, NSwitch, NTreeSelect, NEllipsis, NAlert } from 'naive-ui';
import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { deleteFileReq, downloadFileReq, filePageReq } from '/@/api/File/index';
import { useImpDataTable } from '/@/hooks/useDataTable';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import FileUploadModal from './FileUploadModal.vue';
export default defineComponent({
  components: {
    NDataTable,
    NButton,
    NSpace,
    NInputGroup,
    NInput,
    NIcon,
    NTag,
    NTreeSelect,
    NSwitch,
    NAlert,
    SearchOutlineIcon,
    FileUploadModal,
  },
  setup() {
    // refs
    const FileUploadModalRef = ref();
    // ref
    const cols: TableColumn[] = [
      {
        type: 'selection',
      },
      {
        title: '文件名',
        key: 'name',
      },
      {
        title: '文件大小',
        key: 'size',
      },
      {
        title: '最后修改时间',
        key: 'lastModified',
      },
    ];
    const searchName = ref('');
    // method
    const handleDownload = (row: IObj) => {
      downloadFileReq(row.name);
    };
    const handleAdd = () => {
      FileUploadModalRef.value.open();
    };
    const handleDel = (row?: IObj) => {
      const actionName = '删除';
      const actionMethod = deleteFileReq;
      window.$dialog.error({
        title: '注意',
        content: `你确定${actionName}这些文件？`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          const names = row ? [row.name] : checkedRowKeysRef.value;
          await actionMethod(names);
          window.$message.success('删除成功');
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
        name: '下载',
        func: handleDownload,
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
      checkedRowKeysRef,
      //
      handlePageChange,
      handlePageSizeChange,
      handleSorterChange,
      handleCheck,
      initPage,
      loadPage,
    } = useImpDataTable({
      cols,
      operateOptions,
      pageReq: filePageReq,
      currentQuery,
    });
    const handleSearch = () => {
      initPage();
    };
    onMounted(() => {
      loadPage();
      // loadDictTree();
    });
    return {
      // refs
      FileUploadModalRef,
      // ref
      searchName,
      loading,
      columns,
      pagedTable,
      pagination,
      checkedRowKeysRef,
      //
      handlePageChange,
      handlePageSizeChange,
      handleSorterChange,
      handleCheck,
      handleAdd,
      handleDel,
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
