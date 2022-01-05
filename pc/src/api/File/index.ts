import r from '/@/router/axios';
import { api } from './config';
import { FileInfo } from 'naive-ui/lib/upload/src/interface';

interface FileUploadResponse {
  message: string;
  image_url: string;
}

interface BufferData {
  data: Buffer;
  type: 'Buffer';
}

export const uploadFileReq = (file: FileInfo, withCredentials: boolean | undefined, onProgress: Fn) => {
  const formData = new FormData();
  if (file.file) {
    formData.append('file', file.file);
  }
  return r.request<R<string>>({
    url: `${api.fileUpload}`,
    method: 'POST',
    data: formData,
    withCredentials: withCredentials,
    onUploadProgress: ({ loaded, total }) => {
      onProgress({ percent: Math.ceil((loaded / total) * 100) });
    },
  });
};

export const deleteFileReq = (names: string[]) => {
  return r.request<R<string>>({
    url: `${api.delete}`,
    method: 'DELETE',
    data: names,
  });
};

export const downloadFileReq = (name: string) => {
  return new Promise((resolve, reject) => {
    r.request<R<BufferData>>({
      url: `${api.download}/${name}`,
      method: 'GET',
    }).then(({ payload }) => {
      let ab = new ArrayBuffer(payload.data.length);
      let view = new Uint8Array(ab);
      for (var i = 0; i < payload.data.length; ++i) {
        view[i] = payload.data[i];
      }
      const url = window.URL.createObjectURL(new Blob([ab]));
      console.log(url);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve(0);
    });
  });
};

export const postFileUploadAvatarReq = (data: FormData) => {
  return r.request<R<FileUploadResponse>>({
    url: api.postFileUploadAvatar,
    method: 'POST',
    data,
  });
};

// const downLoadMessage = [
//   "文件较大，正在下载中，请耐心等候",
//   "文件过大，需要较长下载时间，请耐心等候"
// ];
const toDataURL = (url: string) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

export const downloadReq = async (file: Attachment) => {
  const a = document.createElement('a');
  a.href = await toDataURL(file.url);
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const filePageReq = (params: Partial<PageParam>) => {
  return r.request<R<PageResult<IObj>>>({
    url: api.page,
    method: 'GET',
    params,
  });
};

export const delFileById = (id: number) => {
  return r.request<R<boolean>>({
    url: `${api.id}/delete/${id}`,
    method: 'post',
  });
};
