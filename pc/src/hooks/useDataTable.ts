import { TableColumn } from 'naive-ui/lib/data-table/src/interface';
import { ComputedRef, ref } from 'vue';
import { operateColums, OptList } from './Actions';
class PaginationDTO {
  page = 1;
  pageSize = 10;
  pageCount = 1;
  showSizePicker = true;
}
interface DataTableHook {
  cols: TableColumn[];
  operateOptions: OptList[];
  currentQuery?: ComputedRef<IObj>;
  pageReq: Function;
}
export const useImpDataTable = (opt: DataTableHook) => {
  const { cols, operateOptions, currentQuery, pageReq } = opt;
  const loading = ref(false);
  const columns = [...cols, operateColums(operateOptions)];
  const pagedTable = ref<UserPageItemVO[]>([]);
  const pagination = ref(new PaginationDTO());
  const checkedRowKeysRef = ref<string[]>([]);
  //

  const initPage = async () => {
    pagination.value = new PaginationDTO();
    const params = {
      ...pagination.value,
      ...(currentQuery ? currentQuery.value : {}),
    };
    if (!loading.value) {
      loading.value = true;
      const { payload, errorType, message } = await pageReq(params);
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

  const loadPage = async (
    pageObj: IObj = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }
  ) => {
    const params = {
      ...pageObj,
      ...(currentQuery ? currentQuery.value : {}),
    };
    if (!loading.value) {
      loading.value = true;
      const { payload, errorType, message } = await pageReq(params);
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
  const handlePageChange = async (page: number) => {
    await loadPage({
      page,
      pageSize: pagination.value.pageSize,
    });
    if (pagedTable.value.length === 0) {
      initPage();
    }
  };
  const handlePageSizeChange = async (pageSize: number) => {
    await loadPage({
      page: 1,
      pageSize,
    });
    if (pagedTable.value.length === 0) {
      initPage();
    }
  };
  const handleCheck = (rowKeys: string[]) => {
    checkedRowKeysRef.value = rowKeys;
  };
  return {
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
  };
};
