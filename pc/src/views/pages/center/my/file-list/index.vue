<template>
  <imp-page-container>
    <div class="data-table-header">
      <n-space align="center">
        <n-button type="primary" @click="handleAdd()">新增</n-button>
        <n-button @click="handleJsonImport()">从JSON导入</n-button>
        <n-button @click="handleExport()">全部导出</n-button>
        <!-- <n-button @click="handleDownload()">下载</n-button> -->
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
    <n-alert v-if="checkedRowKeysRef.length" style="margin-bottom: 10px" type="info">
      <template #header></template>
      <n-space justify="space-between">
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
      :row-key="(row) => row.id"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @update:checked-row-keys="handleCheck"
      @update:sorter="handleSorterChange"
    />
  </imp-page-container>
  <QuickFormModal ref="QuickFormModalRef" @load-page="loadPage()"></QuickFormModal>
</template>
<script lang="ts">
import { NDataTable, NButton, NSpace, NInputGroup, NInput, NIcon, NTag, NSwitch, NTreeSelect, NEllipsis, NAlert } from 'naive-ui';
import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { computed, defineComponent, onMounted, ref, h } from 'vue';
import { downloadFileByName, filePageReq } from '/@/api/File/index';
import { useImpDataTable } from '/@/hooks/useDataTable';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import { UserInfoDTO } from '/@/types/Admin/User/dto';
import QuickFormModal from '/@/views/pages/clue/Project/QuickFormModal.vue';
import dayjs from 'dayjs';
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
    QuickFormModal,
  },
  setup() {
    // refs
    const QuickFormModalRef = ref();
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
    const handleDownload = async (row: IObj) => {
      const { payload } = await downloadFileByName(row.name);
      let ab = new ArrayBuffer(payload.data.length);
      let view = new Uint8Array(ab);
      for (var i = 0; i < payload.data.length; ++i) {
        view[i] = payload.data[i];
      }
      const url = window.URL.createObjectURL(new Blob([ab]));
      console.log(url);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', row.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const handleAdd = () => {
      QuickFormModalRef.value.add({});
    };
    const handleEdit = (row: IObj) => {
      QuickFormModalRef.value.edit(row);
      // QuickFormModalRef.value.open(row);
    };
    // const handleDownload = () => {
    //   downloadFiles('https://green-manage-pro.oss-cn-hangzhou.aliyuncs.com/prod/3f4efa7f4bd44c45a16142d72f0429fc.pdf', 'demo.pdf');
    // };
    const handleJsonImport = () => {};
    const handleExport = () => {
      const actionName = '导出全部';
      const actionMethod = exportProjectReq;
      window.$dialog.info({
        title: '提醒',
        content: `你确定${actionName}项目？`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          let { payload } = await actionMethod();
          payload = payload.map((m) => {
            return {
              name: m.name,
              desc: m.desc,
              lng: m.location.lng,
              lat: m.location.lat,
              category: m.category,
              happenedAt: m.createdAt,
              updatedAt: dayjs().unix(),
              createdAt: dayjs().unix(),
            };
          });
          const stringjson = JSON.stringify(payload, null, 2);
          // 创建隐藏的可下载链接
          const eleLink = document.createElement('a');
          eleLink.download = `${dayjs().unix()}-all-clue-projects.json`;
          eleLink.style.display = 'none';
          // 字符内容转变成blob地址
          const blob = new Blob([stringjson], { type: 'text/json' });
          eleLink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);

          loadPage();
        },
        onNegativeClick: () => {
          loadPage();
        },
      });
    };
    const handleDel = (row?: IObj) => {
      const actionName = '删除';
      const actionMethod = deleteProjectReq;
      window.$dialog.error({
        title: '注意',
        content: `你确定${actionName}这些项目？`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          const ids = row ? [row.id] : checkedRowKeysRef.value;
          await actionMethod(ids);
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
      QuickFormModalRef,
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
      handleExport,
      handleJsonImport,
      // handleDownload,
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
