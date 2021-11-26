interface R<T> {
  errorType?: string;
  payload: T;
  message?: string;
  timestamp: string;
}

interface PageBase {
  page: number | string;
  pageSize: number | string;
}

interface ParamsBase {
  [key: string]: number | string | null;
}

interface PageParam extends PageBase {
  [key: string]: number | string | boolean | null;
}

interface PageOption extends PageBase {
  total: number | string;
}

interface PageResult<T> extends PageOption {
  pages: number;
  current: number;
  records: Array<T>;
  searchCount: boolean;
}

interface DropdownCustomItem {
  name: string;
  divided?: boolean;
  path?: string;
  handleName?: string;
}

interface SelectOptionVO {
  label: string;
  value: number | string | null;
  [key: string]: number | string | null;
}

interface TimeDifferenceVO {
  hidden: boolean;
  state: boolean;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
