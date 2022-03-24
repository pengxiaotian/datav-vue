<template>
  <div
    class="canvas-area"
    :style="{
      left: startX + 'px',
      top: startY + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
  ></div>
</template>

<script lang="ts" setup>
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
</script>

<style lang="scss" scoped>
.canvas-area {
  position: absolute;
  border: 1px dashed #758391;
  z-index: 1;
}
</style>
