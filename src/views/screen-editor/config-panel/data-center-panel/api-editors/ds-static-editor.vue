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
import { defineComponent, ComputedRef, inject } from 'vue'
import { ApiDataConfig } from '@/components/data-source'

export default defineComponent({
  name: 'DsStaticEditor',
  setup() {
    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>

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
