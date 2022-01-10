import modulePrefix from '../config';
const prefix = `${modulePrefix}/transfy`;

const api = {
  transfy: `${prefix}`,
  page: `${prefix}/page`,
  subtitles: `${prefix}/subtitles`,
  runRec: `${prefix}/run_rec`,
};

export { api };
