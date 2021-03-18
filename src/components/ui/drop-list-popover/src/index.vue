<template>
  <el-popover
    v-model:visible="visible"
    :placement="placement"
    :trigger="trigger"
    width="auto"
    popper-class="drop-list-popover is-dark"
  >
    <template #reference>
      <slot></slot>
    </template>
    <slot name="droplist"></slot>
  </el-popover>
</template>
<script lang='ts'>
import { defineComponent, ref, provide } from 'vue'

export default defineComponent({
  name: 'GDropListPopover',
  props: {
    trigger: {
      type: String,
      default: 'hover',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
  },
  setup() {
    const visible = ref(false)

    provide('hidePopover', () => {
      visible.value = false
    })

    return {
      visible,
    }
  },
})
</script>
