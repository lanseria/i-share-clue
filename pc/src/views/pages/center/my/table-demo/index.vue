<template>
  <imp-page-container>
    <div class="data-table-header">
      <n-space>
        <n-button type="primary" @click="handleAdd()">新增</n-button>
        <n-button>导出</n-button>
        <n-button>删除</n-button>
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
      :row-key="(row) => row.userId"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </imp-page-container>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts" setup>
import { NDataTable, NButton, NSpace, NInputGroup, NInput, NIcon } from 'naive-ui';
import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { onMounted, ref } from 'vue';
import { operateColums, OptList } from './Actions';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import FormModal from './FormModal.vue';
import { adminUserPageReq } from '/@/api/Admin/Access/User';
class PaginationDTO {
  page = 1;
  pageSize = 10;
  pageCount = 1;
  showSizePicker = true;
}
// refs
const FormModalRef = ref();
// ref
const loading = ref(false);
const searchName = ref('');
const pagedTable = ref<any[]>([]);
const pagination = ref(new PaginationDTO());
// method
const loadPage = async (
  params: IObj = {
    current: pagination.value.page,
    size: pagination.value.pageSize,
  }
) => {
  if (!loading.value) {
    loading.value = true;
    const { payload } = await adminUserPageReq(params);
    if (payload) {
      pagedTable.value = payload.records;
      pagination.value.page = +payload.current;
      pagination.value.pageCount = +payload.pages;
    }
    loading.value = false;
  }
};
const handleSearch = () => {
  loadPage({
    current: 1,
    size: pagination.value.pageSize,
    realName: searchName.value,
  });
};
const handlePageChange = async (currentPage: number) => {
  loadPage({
    current: currentPage,
    size: pagination.value.pageSize,
  });
};
const handlePageSizeChange = async (currentPageSize: number) => {
  loadPage({
    current: 1,
    size: currentPageSize,
  });
};
const handleAdd = () => {
  FormModalRef.value.open();
};
const handleEdit = (row: IObj) => {
  FormModalRef.value.open(row);
};
const handleDel = (row: IObj) => {
  console.log(row);
};

onMounted(() => {
  loadPage();
});

const operateOptions: OptList[] = [
  {
    name: '编辑',
    func: handleEdit,
  },
  {
    name: '删除',
    func: handleDel,
  },
];
const columns: TableColumn[] = [
  {
    type: 'selection',
  },
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '真实姓名',
    key: 'realName',
  },
  {
    title: '手机',
    key: 'phone',
  },
  operateColums(operateOptions),
];
</script>
<style lang="css" scoped>
.data-table-header {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
