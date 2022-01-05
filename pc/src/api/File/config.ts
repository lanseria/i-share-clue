const prefix = `/file-upload`;

const api = {
  id: prefix,
  page: `${prefix}/page`,
  file: prefix,
  download: `${prefix}/download`,
  delete: `${prefix}/delete`,
  fileUpload: `${prefix}/file`,
  postFileUploadAvatar: `${prefix}/single`, // GET
};

export { api };
