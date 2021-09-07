<template>
  <n-popover
    :placement="placement"
    :trigger="trigger"
    :delay="delay"
    :show-arrow="false"
    class="g-tooltip-popover"
    :style="{
      '--padding': '6px 10px',
      '--font-size': '12px',
      '--border-radius': '0',
      '--color': 'var(--datav-pop-bg-color)',
      '--text-color': '#fff',
      '--box-shadow': '#000',
    }"
  >
    <template #trigger>
      <slot></slot>
    </template>
    {{ content }}
  </n-popover>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GTooltipPopover',
  props: {
    trigger: {
      type: String,
      default: 'hover',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    delay: {
      type: Number,
      default: 500,
    },
    content: String,
  },
})
</script>
