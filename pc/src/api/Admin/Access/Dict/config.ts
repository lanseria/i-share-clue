import { modulePrefix } from '../config';
const prefix = `${modulePrefix}/dicts`;

const api = {
  dict: `${prefix}`,
  dictPage: `${prefix}/page`,
  dictTree: `${prefix}/tree`,
  getDictAllMap: `${prefix}/get_all_map`, // GET
};

export { api };
