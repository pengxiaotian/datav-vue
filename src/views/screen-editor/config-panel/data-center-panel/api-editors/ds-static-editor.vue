<template>
  <div class="ds-wrapper ds-static">
    <g-monaco-editor
      language="json"
      :auto-format="true"
      :code="apiDataConfig.config.data"
      @blur="updateData"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, inject } from 'vue'
import { sourcePanelInjectionKey } from '../../config'

export default defineComponent({
  name: 'DsStaticEditor',
  setup() {
    const { apiDataConfig } = inject(sourcePanelInjectionKey)

    const updateData = (data: any) => {
      apiDataConfig.value.config.data = data.value
    }

    return {
      apiDataConfig,
      updateData,
    }
  },
})
</script>
