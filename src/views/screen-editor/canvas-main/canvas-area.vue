<template>
  <svg class="canvas-selection">
    <path
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      :d="`M ${startX},${startY} L ${startX},${startY + height} L ${startX + width},${startY + height} L ${startX + width},${startY} Z`"
      style="stroke-width: 1; stroke-dasharray: 3, 3;"
    />
  </svg>
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
.canvas-selection {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
