<template>
  <n-config-provider :theme="theme" :locale="locale" :date-locale="dateLocale" :theme-overrides="themeOverrides" :hljs="hljs">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <Slot />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NConfigProvider, NMessageProvider, NNotificationProvider, NDialogProvider, darkTheme, zhCN as locale, dateZhCN as dateLocale } from 'naive-ui';
import { useAppStore } from './store/modules/app';
import Slot from '/@/views/layouts/Slot.vue';
import hljs from 'highlight.js/lib/core';
import shell from 'highlight.js/lib/languages/shell';
hljs.registerLanguage('shell', shell);
/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {};

const appStore = useAppStore();
const theme = computed(() => {
  return appStore.getTheme === 'dark' ? darkTheme : null;
});
</script>

<style>
#app {
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
