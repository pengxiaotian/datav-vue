<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeOverrides } from '@/styles/themes/naive-ui-theme-overrides'

export default defineComponent({
  name: 'App',
  setup() {
    return {
      themeOverrides,
    }
  },
})
</script>
