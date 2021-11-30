<template>
  <imp-page-container>
    <div class="data-table-header">
      <n-space align="center">
        <n-button type="primary" @click="handleAdd()">新增</n-button>
        <n-button>批量导出</n-button>
        <n-button @click="handleBatchDel()">批量{{ isDelete ? '丢弃' : '删除' }}</n-button>
        <n-switch v-model:value="isDelete" size="large" @update:value="handleSearch()">
          <template #checked>关闭回收站</template>
          <template #unchecked>打开回收站</template>
        </n-switch>
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
import { computed, defineComponent, h, onMounted, ref } from 'vue';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import FormModal from './FormModal.vue';
import { adminUserPageReq, blockUserReq, clearUsersReq, deleteUsersReq, restoreUsersReq, whiteUserReq } from '/@/api/Admin/Access/User';
import { UserInfoDTO, UserStatus } from '/@/types/Admin/User/dto';
import { useImpDataTable } from '/@/hooks/useDataTable';
import { OptList } from '/@/hooks/Actions';

export default defineComponent({
  components: {
    NDataTable,
    NSpace,
    NButton,
    NInputGroup,
    NInput,
    NIcon,
    NSwitch,
    SearchOutlineIcon,
    FormModal,
  },
  setup() {
    // refs
    const FormModalRef = ref();
    // ref
    const searchName = ref('');
    const isDelete = ref(false);
    // computed
    const currentQuery = computed(() => {
      return {
        username: searchName.value,
        isDelete: isDelete.value,
      };
    });
    // method
    const handleSearch = () => {
      initPage();
    };
    const handleAdd = () => {
      FormModalRef.value.open();
    };
    const handleEdit = (row: IObj) => {
      FormModalRef.value.open(row);
    };
    const handleRestore = (row: IObj) => {
      const actionName = '还原';
      const actionMethod = restoreUsersReq;
      window.$dialog.warning({
        title: '警告',
        content: `你确定${actionName}此用户？`,
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
    };
    const handleChangeStatus = (row: IObj) => {
      const actionName = row.status === UserStatus.Active ? '拉黑' : '激活';
      const actionMethod = row.status === UserStatus.Active ? blockUserReq : whiteUserReq;
      window.$dialog.warning({
        title: '警告',
        content: `你确定${actionName}此用户？`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          await actionMethod(row.id);
          loadPage();
        },
        onNegativeClick: () => {
          loadPage();
        },
      });
    };
    const handleBatchDel = () => {
      window.$dialog.error({
        title: '注意',
        content: `你确定删除这些用户？(可还原)`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          await deleteUsersReq(checkedRowKeysRef.value);
          loadPage();
        },
        onNegativeClick: () => {
          loadPage();
        },
      });
    };
    const handleDel = (row: IObj) => {
      const actionName = isDelete.value ? '丢弃' : '删除(可还原)';
      const actionMethod = isDelete.value ? clearUsersReq : deleteUsersReq;
      window.$dialog.error({
        title: '注意',
        content: `你确定${actionName}此用户？`,
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
    };

    onMounted(() => {
      loadPage();
    });

    const operateOptions: OptList[] = [
      {
        name: '编辑',
        func: handleEdit,
        hidden: (row) => {
          return !isDelete.value;
        },
      },
      {
        name: '还原',
        func: handleRestore,
        hidden: (row) => {
          return isDelete.value;
        },
      },
      {
        name: (row: IObj) => {
          return row.status === UserStatus.Active ? '拉黑' : '激活';
        },
        func: handleChangeStatus,
        hidden: (row) => {
          return !isDelete.value;
        },
      },
      {
        name: () => (isDelete.value ? '丢弃' : '删除'),
        func: handleDel,
        hidden: (row) => {
          return !row.isSuperUser;
        },
      },
    ];
    const cols: TableColumn[] = [
      {
        type: 'selection',
      },
      {
        title: '用户名',
        key: 'username',
        render(row) {
          const line = new UserInfoDTO();
          line.mergeProperties(row);
          return h(
            NSpace,
            { align: 'center' },
            {
              default: () => [
                line.username,
                ...(line.isSuperUser
                  ? [
                      h(
                        NTag,
                        { type: 'success' },
                        {
                          default: () => '超级管理员',
                        }
                      ),
                    ]
                  : []),
              ],
            }
          );
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
      handleCheck,
      initPage,
      loadPage,
    } = useImpDataTable({
      cols,
      operateOptions,
      pageReq: adminUserPageReq,
      currentQuery,
    });
    return {
      // refs
      FormModalRef,
      // ref
      handleCheck,
      searchName,
      isDelete,
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
      handleBatchDel,
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
