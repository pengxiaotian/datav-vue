<template>
  <div class="setting-panel">
    <div class="setting-panel-content">
      <div class="scroll-container">
        <div class="setting-panel-gui">
          <props-config-preview :configs="configs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { PropDto } from '@/domains/dev/prop-config'
import PropsConfigPreview from './props-config-preview.vue'

export default defineComponent({
  name: 'PropsConfigPanel',
  components: {
    PropsConfigPreview,
  },
  props: {
    configs: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.setting-panel {
  position: relative;
  width: 332px;
  height: 100vh;
}

.setting-panel-content {
  position: absolute;
  top: 12px;
  bottom: 12px;
  width: 100%;
  overflow-y: auto;
}

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 534px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
