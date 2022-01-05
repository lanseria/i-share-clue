<template>
  <n-upload abstract ref="UploadRef" :max="1" :accept="accept" :customRequest="customRequest" :on-remove="handleRemove">
    <div>
      <vue3VideoPlay v-show="showVideo" v-bind="options" />
      <n-upload-trigger #="{ handleClick }" abstract>
        <n-upload-dragger v-show="!showVideo" @click="handleClick">
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">请不要上传敏感数据，支持 {{ accept }}</n-p>
        </n-upload-dragger>
      </n-upload-trigger>

      <n-card v-show="showVideo" embedded :bordered="false" style="margin-top: 12px">
        <n-upload-file-list />
      </n-card>
    </div>
  </n-upload>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { NUpload, NUploadDragger, NUploadFileList, NUploadTrigger, NIcon, NP, NText, NCard } from 'naive-ui';
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
    NUploadFileList,
    NUploadTrigger,
    NCard,
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
    const accept = ref('.mkv,.mp4,.flv,.avi,');
    const showVideo = ref(false);
    const options = computed(() => {
      return {
        width: '480px', //播放器高度
        height: '240px', //播放器高度
        color: '#409eff', //主题色
        currentTime: 0,
        speed: false, //关闭进度条拖动
        title: '', //视频名称
        src: uploadUrl.value, //视频源
      };
    });
    const customRequest: CustomRequest = ({ file, withCredentials, onFinish, onError, onProgress }) => {
      uploadFileReq(file, withCredentials, onProgress)
        .then(({ payload }: any) => {
          onFinish();
          setTimeout(() => {
            handleFinish(payload);
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
          onError();
        });
    };
    const handleFinish = (payload: any) => {
      showVideo.value = true;
      // console.log(payload);
      uploadUrl.value = 'http://' + payload.url;
    };
    const handleRemove = () => {
      console.log('remove');
      showVideo.value = false;
      uploadUrl.value = '';
    };
    return {
      UploadRef,
      // ref
      accept,
      showVideo,
      uploadUrl,
      // computed
      options,
      // method
      customRequest,
      handleRemove,
    };
  },
});
</script>
