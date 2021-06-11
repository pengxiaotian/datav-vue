<template>
  <div class="setting-panel-gui">
    <g-field :level="2" label="背景颜色">
      <g-color-picker v-model="config.backgroundStyle.bgColor" />
    </g-field>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { BorderBox_1 } from './border-box-1'

export default defineComponent({
  name: 'VVBorderBox1Prop',
  props: {
    com: {
      type: Object as PropType<BorderBox_1>,
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
<style lang=""></style>
