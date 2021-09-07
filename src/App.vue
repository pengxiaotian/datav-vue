<template>
  <n-config-provider :theme-overrides="themeOverrides" abstract>
    <n-message-provider closable>
      <n-dialog-provider>
        <AppMessage />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeOverrides } from '@/styles/themes/naive-ui-theme-overrides'
import AppMessage from './AppMessage.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppMessage,
  },
  setup() {
    return {
      themeOverrides,
    }
  },
})
</script>
