<template>
  <NConfigProvider :theme-overrides="themeOverrides" abstract inline-theme-disabled>
    <NMessageProvider>
      <NNotificationProvider>
        <NLoadingBarProvider>
          <NDialogProvider>
            <NuxtPage />
          </NDialogProvider>
        </NLoadingBarProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  NDialogProvider,
} from 'naive-ui'
import { themeOverrides } from '@/styles/themes/naive-ui-theme-overrides'
</script>

<style lang="scss">
@import '../src/styles/index.scss';
@import '~~/assets/styles/index.scss';
</style>
