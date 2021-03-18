<template>
  <a
    class="drop-list-item"
    href="javascript:;"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon"></i>
    <span class="drop-text" :class="icon ? '' : ' --no-icon'">
      <slot></slot>
    </span>
  </a>
</template>
<script lang='ts'>
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'GDropListItem',
  props: {
    icon: String,
  },
  setup() {
    const handleClick = inject('hidePopover')

    return {
      handleClick,
    }
  },
})
</script>
