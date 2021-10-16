<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="框"
    >
      <g-field
        :level="2"
        label="样式"
      >
        <g-select-image
          v-model="config.boxStyle.style"
          :images="presetImages"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import { BorderBox, presetImages } from './border-box'

export default defineComponent({
  name: 'VBorderBoxProp',
  props: {
    com: {
      type: Object as PropType<BorderBox>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      presetImages,
    }
  },
})
</script>
