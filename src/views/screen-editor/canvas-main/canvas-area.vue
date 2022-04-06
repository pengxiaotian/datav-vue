<template>
  <div
    class="canvas-area"
    :style="{
      left: startX + 'px',
      top: startY + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
    @mousedown.stop
    @contextmenu="showMenu"
  ></div>
</template>

<script lang="ts" setup>
import { useContextMenu } from '../editor-context-menu'

defineProps({
  startX: {
    type: Number,
    default: 0,
  },
  startY: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
})

const { showMenu } = useContextMenu()
</script>

<style lang="scss" scoped>
.canvas-area {
  position: absolute;
  border: 1px dashed #758391;
  z-index: 1;
}
</style>
