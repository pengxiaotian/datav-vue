<template>
  <el-popover
    :placement="placement"
    :trigger="trigger"
    width="auto"
    :show-arrow="false"
    :content="content"
    popper-class="tooltip-popover"
  >
    <template #reference>
      <slot></slot>
    </template>
  </el-popover>
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
    content: String,
  },
})
</script>
