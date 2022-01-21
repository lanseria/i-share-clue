<template>
  <n-form ref="FormRef" :label-width="80" :rules="rules" :model="modelRef">
    <n-form-item label="手机号" path="mobile">
      <n-input placeholder="请输入手机号" :maxlength="11" v-model:value="modelRef.mobile">
        <template #prefix>
          <n-icon>
            <phone-portrait-outline-icon />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>

    <n-form-item label="验证码" path="code">
      <code-input :codephone="modelRef.mobile" placeholder="请输入验证码" :maxlength="4" v-model:value="modelRef.code"></code-input>
    </n-form-item>
    <n-form-item label="服务条款" path="checkService">
      <n-checkbox v-model:checked="modelRef.checkService">我已经阅读并同意</n-checkbox>
    </n-form-item>

    <n-form-item>
      <n-grid x-gap="12" :cols="2">
        <n-grid-item>
          <n-button type="primary" block @click="handleSubmit()">注册</n-button>
        </n-grid-item>
        <n-grid-item>
          <n-button block @click="handleLogin()">登录</n-button>
        </n-grid-item>
      </n-grid>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { registerRules as rules } from './options';
import { NForm, NFormItem, NInput, NButton, NIcon, NGrid, NGridItem, NCheckbox } from 'naive-ui';
import { PhonePortraitOutline as PhonePortraitOutlineIcon } from '@vicons/ionicons5';
import { useImpSubmit } from '/@/hooks/useForm';
import CodeInput from './CodeInput.vue';
import { useUserStore } from '/@/store/modules/user';
import { useImpRoute } from '/@/hooks/useRoute';
// use
const userStore = useUserStore();
const { impSubmitLoading, impSubmit } = useImpSubmit();
const { routing, pushName } = useImpRoute();
// refs
const FormRef = ref();
// ref
const modelRef = ref({
  mobile: '',
  code: '',
  checkService: true,
});
// computed
const operating = computed(() => {
  return impSubmitLoading.value || routing.value;
});
// method
const handleLogin = () => {
  pushName('Login');
};

// method
const submitAction = async () => {
  try {
    await userStore.smsLogin(modelRef.value);
  } catch (error) {
    console.log(error);
  } finally {
    // refresh code
  }
};
const handleSubmit = () => {
  if (modelRef.value.checkService) {
    impSubmit(FormRef.value, submitAction);
  } else {
    window.$message.warning('请阅读并同意服务条款和隐私协议后，方可进行下一步操作！');
  }
};
</script>
