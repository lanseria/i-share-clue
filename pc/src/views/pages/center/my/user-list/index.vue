<template>
  <imp-page-container>
    <div class="data-table-header">
      <n-space>
        <n-button type="primary" @click="handleAdd()">新增</n-button>
        <n-button>批量导出</n-button>
        <n-button>批量删除</n-button>
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
    />
  </imp-page-container>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts">
import { NDataTable, NButton, NSpace, NInputGroup, NInput, NIcon, NTag } from 'naive-ui';
import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { defineComponent, h, onMounted, ref } from 'vue';
import { operateColums, OptList } from './Actions';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import FormModal from './FormModal.vue';
import { adminUserPageReq } from '/@/api/Admin/Access/User';
import { UserInfoDTO } from '/@/types/Admin/User/dto';
class PaginationDTO {
  page = 1;
  pageSize = 10;
  pageCount = 1;
  showSizePicker = true;
}
export default defineComponent({
  components: {
    NDataTable,
    NSpace,
    NButton,
    NInputGroup,
    NInput,
    NIcon,
    SearchOutlineIcon,
    FormModal,
  },
  setup() {
    // refs
    const FormModalRef = ref();
    // ref
    const loading = ref(false);
    const searchName = ref('');
    const pagedTable = ref<UserPageItemVO[]>([]);
    const pagination = ref(new PaginationDTO());
    // method
    const loadPage = async (
      params: IObj = {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
      }
    ) => {
      if (!loading.value) {
        loading.value = true;
        const { payload, errorType, message } = await adminUserPageReq(params);
        if (errorType) {
          window.$message.warning(message!);
        } else {
          pagedTable.value = payload.records;
          pagination.value.page = +payload.current;
          pagination.value.pageCount = +payload.pages;
        }
        loading.value = false;
      }
    };
    const handleSearch = () => {
      loadPage({
        page: 1,
        pageSize: pagination.value.pageSize,
        username: searchName.value,
      });
    };
    const handlePageChange = async (currentPage: number) => {
      loadPage({
        page: currentPage,
        pageSize: pagination.value.pageSize,
      });
    };
    const handlePageSizeChange = async (currentPageSize: number) => {
      loadPage({
        page: 1,
        pageSize: currentPageSize,
      });
    };
    const handleAdd = () => {
      FormModalRef.value.open();
    };
    const handleEdit = (row: IObj) => {
      FormModalRef.value.open(row);
    };
    const handleBlock = (row: IObj) => {
      console.log(row);
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
        name: '拉黑',
        func: handleBlock,
      },
      {
        name: '删除',
        func: handleDel,
        hidden: (row) => {
          return !row.isSuperUser;
        },
      },
    ];
    const columns: TableColumn[] = [
      {
        type: 'selection',
      },
      {
        title: '用户名',
        key: 'username',
        render(row) {
          const line = new UserInfoDTO();
          line.mergeProperties(row);
          return h(NSpace, { align: 'center' }, [line.username, ...(line.isSuperUser ? [h(NTag, { type: 'success' }, '超级管理员')] : [])]);
        },
      },
      {
        title: '名字',
        key: 'realName',
        render(row) {
          const line = new UserInfoDTO();
          line.mergeProperties(row);
          return h('span', null, line.firstName + line.lastName);
        },
      },
      {
        title: '状态',
        key: 'status',
      },
      operateColums(operateOptions),
    ];
    return {
      // refs
      FormModalRef,
      // ref
      searchName,
      loading,
      columns,
      pagedTable,
      pagination,
      // method
      loadPage,
      handleAdd,
      handleSearch,
      handlePageChange,
      handlePageSizeChange,
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
