<template>
  <n-config-provider :theme-overrides="themeOverrides" abstract>
    <n-message-provider closable keep-alive-on-hover>
      <n-dialog-provider>
        <App />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeOverrides } from '@/styles/themes/naive-ui-theme-overrides'
import App from './App.vue'

export default defineComponent({
  name: 'AppRoot',
  components: {
    App,
  },
  setup() {
    return {
      themeOverrides,
    }
  },
})
</script>
