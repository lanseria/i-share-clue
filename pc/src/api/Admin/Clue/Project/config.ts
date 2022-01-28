import modulePrefix from '../config';
const prefix = `${modulePrefix}/project`;

const api = {
  project: `${prefix}`,
  area: `${prefix}/area`,
  page: `${prefix}/page`,
  export: `${prefix}/export`,
  import: `${prefix}/import`,
};

export { api };
