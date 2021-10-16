<template>
  <div class="setting-panel">
    <div class="setting-panel-content">
      <div class="scroll-container">
        <div class="setting-panel-gui">
          <preview-prop :config="config" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { PropDto } from '../props-config/config'
import PreviewProp from './preview-prop.vue'

export default defineComponent({
  name: 'ConfigPreview',
  components: {
    PreviewProp,
  },
  props: {
    config: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss">
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
}

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 534px;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
