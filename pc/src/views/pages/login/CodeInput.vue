<template>
  <n-input-group>
    <n-input v-bind="$attrs">
      <template #prefix>
        <n-icon>
          <keypad-outline-icon />
        </n-icon>
      </template>
    </n-input>
    <n-button type="primary" ghost :disabled="btnDisabled" @click="handleSendcode()">{{ btnText }}</n-button>
  </n-input-group>
</template>
<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { NInput, NInputGroup, NIcon, NButton } from 'naive-ui';
import { KeypadOutline as KeypadOutlineIcon } from '@vicons/ionicons5';
import { validMobile } from '/@/utils/Validation';
import { mobileCaptchaReq } from '/@/api/Admin/Access/Mobile';
const props = defineProps<{
  codephone: string;
}>();
const MSGINIT = '发送验证码',
  MSGSCUCCESS = '${time}秒后重发',
  MSGTIME = 60;
const btnText = ref(MSGINIT);
const btnDisabled = ref(false);
const sendMsgTime = ref(MSGTIME);
// method
const handleSendcode = async () => {
  const res = validMobile(props.codephone);
  console.log(res);
  if (res[0]) {
    window.$message.warning(res[1]);
    return;
  }
  if (btnDisabled.value) return;
  try {
    const { payload } = await mobileCaptchaReq(props.codephone);
    if (payload) {
      btnDisabled.value = true;
      window.$message.success('验证码发送成功');
      btnText.value = MSGSCUCCESS.replace('${time}', sendMsgTime.value.toString());
      const time = setInterval(() => {
        sendMsgTime.value--;
        btnText.value = MSGSCUCCESS.replace('${time}', sendMsgTime.value.toString());
        if (sendMsgTime.value == 0) {
          sendMsgTime.value = MSGTIME;
          btnText.value = MSGINIT;
          btnDisabled.value = false;
          clearInterval(time);
        }
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
