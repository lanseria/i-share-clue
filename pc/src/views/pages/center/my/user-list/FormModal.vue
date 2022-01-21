<template>
  <imp-modal ref="ImpModalRef" :title="`${actionProp.actionName}用户`" @leave="close()">
    <n-form :model="modelRef" ref="formRef">
      <n-form-item path="username" label="用户名">
        <n-input v-model:value="modelRef.username" />
      </n-form-item>
      <n-form-item path="lastName" label="名字">
        <n-input v-model:value="modelRef.lastName" />
      </n-form-item>
      <n-form-item path="firstName" label="姓">
        <n-input v-model:value="modelRef.firstName" />
      </n-form-item>
      <n-form-item v-if="!isEdit" path="password" label="密码">
        <n-input v-model:value="modelRef.password" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space>
        <n-button type="primary" @click="onSubmit()">保存</n-button>
        <n-button @click="close()">返回</n-button>
      </n-space>
    </template>
  </imp-modal>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NInput, NSpace, NButton } from 'naive-ui';
import { computed, ref } from 'vue';
import { createUserReq, updateUserReq } from '/@/api/Admin/Access/User';
import { CreateUserFormDTO } from '/@/types/Admin/User/dto';
const emit = defineEmits(['load-page']);
// refs
const ImpModalRef = ref();
const isEdit = ref(false);
// ref
const modelRef = ref(new CreateUserFormDTO());
const actionProp = computed(() => {
  if (isEdit.value) {
    return {
      actionName: '编辑',
      actionMethod: updateUserReq,
    };
  } else {
    return {
      actionName: '创建',
      actionMethod: createUserReq,
    };
  }
});
// method
const open = (row?: IObj) => {
  if (row) {
    isEdit.value = true;
    modelRef.value.mergeProperties(row);
  } else {
    isEdit.value = false;
  }
  ImpModalRef.value.showModal = true;
};
const close = () => {
  modelRef.value = new CreateUserFormDTO();
  ImpModalRef.value.showModal = false;
  emit('load-page');
};
const onSubmit = async () => {
  const { errorType } = await actionProp.value.actionMethod(modelRef.value);
  if (!errorType) {
    window.$message.success('操作成功');
    close();
  }
};
defineExpose({
  open,
  close,
});
</script>
