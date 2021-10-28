<template>
  <imp-modal ref="ImpModalRef" title="添加信息">
    <n-form :model="modelRef" ref="formRef">
      <n-form-item path="name" label="信息名称">
        <n-input v-model:value="modelRef.name" />
      </n-form-item>
      <n-form-item path="website" label="网站地址">
        <n-input v-model:value="modelRef.website" />
      </n-form-item>
      <n-form-item path="desc" label="信息描述">
        <n-input v-model:value="modelRef.desc" />
      </n-form-item>
      <n-form-item path="category" label="类型">
        <n-input v-model:value="modelRef.category" />
      </n-form-item>
      <n-form-item path="region" label="地域类型">
        <n-input v-model:value="modelRef.region" />
      </n-form-item>
      <template v-if="modelRef.location">
        <n-form-item path="lng" label="经度">
          <n-input-number v-model:value="modelRef.location.lng" />
        </n-form-item>
        <n-form-item path="lat" label="纬度">
          <n-input-number v-model:value="modelRef.location.lat" />
        </n-form-item>
      </template>
    </n-form>
    <template #footer>
      <n-space>
        <n-button type="primary" @click="handleSubmit()">保存</n-button>
        <n-button @click="close()">返回</n-button>
      </n-space>
    </template>
  </imp-modal>
</template>
<script lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NButton,
  NInputNumber
} from "naive-ui";
import { defineComponent, ref } from "vue";
import { createProjectReq } from "/@/api/Admin/Clue/Project";
import { CreateProjectFormDTO } from "/@/types/Admin/Clue/Project/dto";

export default defineComponent({
  emits: ["load-page"],
  components: {
    NForm,
    NFormItem,
    NInput,
    NSpace,
    NButton,
    NInputNumber
  },
  setup(props, { emit }) {
    // refs
    const ImpModalRef = ref();
    // ref
    const modelRef = ref(new CreateProjectFormDTO());
    // method
    const open = (row?: IObj) => {
      if (row) {
        modelRef.value.mergeProperties(row);
      }
      ImpModalRef.value.showModal = true;
    };
    const close = () => {
      modelRef.value = new CreateProjectFormDTO();
      ImpModalRef.value.showModal = false;
      emit("load-page");
    };
    const handleSubmit = async () => {
      const data = await createProjectReq(modelRef.value);
      console.log(data);
    };
    return {
      // refs
      ImpModalRef,
      // ref
      modelRef,
      // method
      open,
      close,
      handleSubmit
    };
  }
});
</script>
