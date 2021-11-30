import { modulePrefix } from '../config';
const prefix = `${modulePrefix}/dicts`;

const api = {
  dict: `${prefix}`,
  dictPage: `${prefix}/page`,
  getDictAllMap: `${prefix}/get_all_map`, // GET
};

export { api };
