<template>
  <imp-page-container>
    <template #extra>
      <n-button
        type="primary"
        :loading="impSubmitLoading"
        :disabled="impSubmitLoading"
        @click="handleSubmit()"
        >保存</n-button
      >
    </template>
    <n-form
      :model="modelRef"
      ref="FormRef"
      label-placement="left"
      :label-width="120"
      style="margin-top: 40px"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="24" label="用户名" path="username">
          <n-input
            placeholder="请输入用户名"
            disabled
            v-model:value="modelRef.username"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="姓氏" path="firstName">
          <n-input
            placeholder="请输入姓氏"
            v-model:value="modelRef.firstName"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="名字" path="lastName">
          <n-input placeholder="请输入名字" v-model:value="modelRef.lastName" />
        </n-form-item-gi>

        <n-form-item-gi :span="24" label="头像" path="avatar">
          <image-upload v-model="modelRef.avatar"></image-upload>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </imp-page-container>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  NGrid,
  NButton,
  NFormItemGi,
  NForm,
  NInput
  // NDynamicTags
} from "naive-ui";
import { useImpPageLoad } from "/@/hooks/useLoad";
import { editDetailReq, userInfoReq } from "/@/api/Admin/Access/User";
import { UserInfoDTO } from "/@/types/Admin/User/dto";
import { useImpSubmit } from "/@/hooks/useForm";
import ImageUpload from "/@/components/common/ImageUpload.vue";
import { useUserStore } from "/@/store/modules/user";
// import DataDictSelect from "/@/components/common/DataDictSelect.vue";
export default defineComponent({
  components: {
    NGrid,
    NButton,
    NFormItemGi,
    NForm,
    NInput,
    // NDynamicTags,
    ImageUpload
    // DataDictSelect
  },
  setup() {
    // use
    const { impPageLoading, impPageLoad } = useImpPageLoad();
    const { impSubmitLoading, impSubmit } = useImpSubmit();
    // refs
    const FormRef = ref();
    // ref
    const modelRef = ref(new UserInfoDTO());
    // method
    const pageAction = async () => {
      const { payload } = await userInfoReq();
      modelRef.value.mergeProperties(payload);

      const userStore = useUserStore();
      userStore.setUserInfo(payload);
    };
    const loadPage = async () => {
      await impPageLoad(pageAction);
    };
    const submitAction = async () => {
      try {
        const { payload } = await editDetailReq(modelRef.value);
        if (payload) {
          window.$message.success("保存成功");
          loadPage();
        }
      } catch (error) {
        console.error(error);
      }
    };
    const handleSubmit = async () => {
      impSubmit(FormRef.value, submitAction);
    };
    // hook
    onMounted(() => {
      loadPage();
    });
    return {
      // refs
      FormRef,
      // ref
      impPageLoading,
      impSubmitLoading,
      modelRef,
      // method
      handleSubmit
    };
  }
});
</script>
