<template>
  <el-popover
    :placement="placement"
    :trigger="trigger"
    :show-arrow="false"
    :content="content"
    :show-after="showAfter"
    :enterable="false"
    :offset="5"
    width="auto"
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
    showAfter: {
      type: Number,
      default: 500,
    },
    content: String,
  },
})
</script>
