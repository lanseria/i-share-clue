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
</template>
<script lang="ts">
import { NDataTable, NButton, NSpace, NInputGroup, NInput, NIcon, NTag, NSwitch, TreeSelectOption, NTreeSelect } from 'naive-ui';
import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { computed, defineComponent, onMounted, ref, h } from 'vue';
import { deleteProjectReq, getProjectPageReq } from '/@/api/Admin/Clue/Project';
import { useImpDataTable } from '/@/hooks/useDataTable';
import { SearchOutline as SearchOutlineIcon } from '@vicons/ionicons5';
import { UserInfoDTO } from '/@/types/Admin/User/dto';
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
    SearchOutlineIcon,
  },
  setup() {
    // refs
    const FormModalRef = ref();
    // ref
    const cols: TableColumn[] = [
      {
        type: 'selection',
      },
      {
        title: '项目标题',
        key: 'name',
      },
      {
        title: '项目描述',
        key: 'desc',
      },
      {
        title: '网站',
        key: 'website',
      },
      {
        title: '创建者',
        key: 'user',
        render(row: any) {
          const creator: UserInfoDTO = row.creator;
          return h(
            NSpace,
            { align: 'center' },
            {
              default: () => [
                creator.username,
                ...(creator.isSuperUser
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
    ];
    const searchName = ref('');
    const dictTreeOptions = ref<TreeSelectOption[]>([]);
    // method
    const handleEnter = (row: IObj) => {
      // handleSearch();
    };
    const handleAdd = () => {
      // FormModalRef.value.open(null, {
      //   parentId: pid.value,
      // });
    };
    const handleEdit = (row: IObj) => {
      // FormModalRef.value.open(row);
    };
    const handleDel = (row: IObj) => {
      const actionName = '删除';
      const actionMethod = deleteProjectReq;
      window.$dialog.error({
        title: '注意',
        content: `你确定${actionName}此项目？`,
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
        name: '进入',
        func: handleEnter,
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
      //
      handlePageChange,
      handlePageSizeChange,
      handleCheck,
      initPage,
      loadPage,
    } = useImpDataTable({
      cols,
      operateOptions,
      pageReq: getProjectPageReq,
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
      FormModalRef,
      // ref
      searchName,
      loading,
      columns,
      pagedTable,
      pagination,
      dictTreeOptions,
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
