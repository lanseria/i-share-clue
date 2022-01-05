<template>
  <n-upload ref="UploadRef" :max="1" accept=".mkv,.mp4,.flv,.avi," :customRequest="customRequest" :on-remove="handleRemove">
    <n-upload-dragger v-show="!showVideo">
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <archive-icon />
        </n-icon>
      </div>
      <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
      <n-p depth="3" style="margin: 8px 0 0 0">请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码</n-p>
    </n-upload-dragger>
    <!-- <video v-else controls autoplay name="media">
      <source :src="uploadUrl" type="video/mp4" />
    </video> -->
    <video v-show="showVideo" width="480" height="240" controls>
      <source :src="uploadUrl" type="video/mp4" />
      您的浏览器不支持 HTML5 video 标签。
    </video>
  </n-upload>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NUpload, NUploadDragger, NIcon, NP, NText } from 'naive-ui';
import { Archive as ArchiveIcon } from '@vicons/ionicons5';
import { uploadFileReq } from '/@/api/File';
import { CustomRequest } from 'naive-ui/lib/upload/src/interface';
import { useVModel } from '@vueuse/core';
export default defineComponent({
  name: 'TransfyUploadVideo',
  components: {
    NUpload,
    NUploadDragger,
    NIcon,
    NP,
    NText,
    ArchiveIcon,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const uploadUrl = useVModel(props, 'url', emit);
    const UploadRef = ref();
    const showVideo = ref(false);
    const customRequest: CustomRequest = ({ file, withCredentials, onFinish, onError, onProgress }) => {
      uploadFileReq(file, withCredentials, onProgress)
        .then(({ payload }: any) => {
          console.log(payload);
          uploadUrl.value = 'http://' + payload.url;
          onFinish();
          handleFinish();
        })
        .catch((error) => {
          console.log(error);
          onError();
        });
    };
    const handleFinish = () => {
      showVideo.value = true;
    };
    const handleRemove = () => {
      console.log('remove');
      showVideo.value = false;
      uploadUrl.value = '';
    };
    return {
      UploadRef,
      // ref
      showVideo,
      uploadUrl,
      // method
      customRequest,
      handleRemove,
    };
  },
});
</script>
