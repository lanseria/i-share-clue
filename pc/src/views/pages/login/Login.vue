<template>
  <n-form ref="FormRef" :label-width="80" :rules="rules" :model="modelRef">
    <n-form-item label="账号" path="username">
      <n-input placeholder="请输入账号" :input-props="{ autocomplete: 'username' }" :maxlength="16" v-model:value="modelRef.username">
        <template #prefix>
          <n-icon>
            <person-outline-icon />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item label="密码" path="password">
      <n-input
        type="password"
        showPasswordOn="click"
        placeholder="请输入密码"
        :input-props="{ autocomplete: 'current-password' }"
        :maxlength="16"
        v-model:value="modelRef.password"
      >
        <template #prefix>
          <n-icon>
            <key-outline-icon />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>
    <!-- <n-form-item label="验证码" path="code">
      <n-input placeholder="请输入验证码" :maxlength="2" v-model:value="modelRef.code" @keyup.enter="handleSubmit()">
        <template #prefix>
          <n-icon>
            <keypad-outline-icon />
          </n-icon>
        </template>
        <template #suffix>
          <code-img ref="CodeImgRef" @refresh="refreshRandomStr"></code-img>
        </template>
      </n-input>
    </n-form-item> -->
    <n-form-item>
      <n-grid x-gap="12" :cols="2">
        <n-grid-item>
          <n-button type="primary" block :loading="operating" :disabled="operating" @click="handleSubmit()">登录</n-button>
        </n-grid-item>
        <n-grid-item>
          <n-button block :loading="operating" :disabled="operating" @click="handleRegister()">注册</n-button>
        </n-grid-item>
      </n-grid>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import CodeImg from './CodeImg.vue';
import { NForm, NFormItem, NInput, NButton, NIcon, NGrid, NGridItem } from 'naive-ui';
import {
  PersonOutline as PersonOutlineIcon,
  KeyOutline as KeyOutlineIcon,
  // KeypadOutline as KeypadOutlineIcon
} from '@vicons/ionicons5';
import { computed, ref } from 'vue';
import { loginRules as rules } from './options';
import { useUserStore } from '/@/store/modules/user';
import { useImpSubmit } from '/@/hooks/useForm';
import { useImpRoute } from '/@/hooks/useRoute';
// use
const userStore = useUserStore();
const { impSubmitLoading, impSubmit } = useImpSubmit();
const { routing, pushName } = useImpRoute();
// refs
const FormRef = ref();
const CodeImgRef = ref<InstanceType<typeof CodeImg> | null>(null);
const modelRef = ref({
  username: '',
  mobile: '',
  password: '',
  code: '',
  randomStr: '',
});
// computed
const operating = computed(() => {
  return impSubmitLoading.value || routing.value;
});
// method
const refreshRandomStr = (randomStr: string) => {
  modelRef.value.code = '';
  modelRef.value.randomStr = randomStr;
};
const submitAction = async () => {
  try {
    await userStore.login(modelRef.value);
  } catch (error) {
    console.log(error);
  } finally {
    // refresh code
    CodeImgRef.value?.refreshCode();
  }
};
const handleSubmit = () => {
  impSubmit(FormRef.value, submitAction);
};
const handleRegister = async () => {
  pushName('Register');
};
</script>
