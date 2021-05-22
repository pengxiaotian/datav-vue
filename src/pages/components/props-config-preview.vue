<template>
  <div class="setting-panel">
    <div class="setting-panel-content">
      <div class="scroll-container">
        <!-- <component
          :is="com.name + 'Prop'"
          :key="com.id"
          :com="com"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import { PropDto, ComponentType, DisplayMode } from '@/domains/dev/prop-config'

export default defineComponent({
  name: 'PropsConfigForm',
  components: {
  },
  props: {
    configs: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
  },
  setup() {
    const componentTypes = ref({ ...ComponentType })
    const displayModes = ref({ ...DisplayMode })

    return {
      componentTypes,
      displayModes,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.setting-panel {
  position: relative;
  width: 100%;
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
