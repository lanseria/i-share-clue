import { ComputedRef, reactive, ref } from 'vue';
class PaginationDTO {
  page = 1;
  pageSize = 8;
  pageCount = 1;
  showSizePicker = true;
  constructor(pageSize = 8) {
    this.pageSize = pageSize;
  }
}
interface DataTableHook {
  pageSize?: number;
  currentQuery?: ComputedRef<IObj>;
  pageReq: Function;
}
export const useImpDataGrid = (opt: DataTableHook) => {
  const { pageSize, currentQuery, pageReq } = opt;
  const loading = ref(false);
  const order: IObj = {};
  const pagedTable = ref<any[]>([]);
  const pagination = ref(new PaginationDTO(pageSize));
  const checkedRowKeysRef = ref<string[]>([]);
  //

  const initPage = async () => {
    pagination.value = new PaginationDTO();
    const params = {
      ...pagination.value,
      ...(currentQuery ? currentQuery.value : {}),
      orderBy: order,
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
      handleCheck();
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
  const handleCheck = (rowKeys: string[] = []) => {
    checkedRowKeysRef.value = rowKeys;
  };
  return {
    loading,
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
