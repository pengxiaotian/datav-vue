<template>
  <div class="setting-panel-gui">
    <g-field :level="2" label="背景颜色">
      <g-color-picker v-model="config.background" />
    </g-field>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { BorderBox1 } from './border-box-1'

export default defineComponent({
  name: 'VBorderBox1Prop',
  props: {
    com: {
      type: Object as PropType<BorderBox1>,
      require: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    return {
      config,
    }
  },
})
</script>
