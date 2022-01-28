<template>
  <imp-modal ref="ImpModalRef" title="添加文件" @leave="leave">
    <n-upload action="/api/file-upload/file" @finish="handleFinish">
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <archive-icon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码</n-p>
      </n-upload-dragger>
    </n-upload>
  </imp-modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { NUpload, NUploadDragger, NIcon, NP, NText } from 'naive-ui';
import { Archive as ArchiveIcon } from '@vicons/ionicons5';
const emit = defineEmits(['leave']);
const ImpModalRef = ref();
const open = () => {
  ImpModalRef.value.showModal = true;
};
const leave = () => {
  emit('leave');
};
const handleFinish = ({ file, event }) => {
  window.$message.success(event.target.response);
};
</script>
