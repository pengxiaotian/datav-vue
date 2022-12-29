<template>
  <span class="g-select-shape-item">
    <n-icon>
      <IconShapeDiamond v-if="icon === 'shape-diamond'" />
      <IconShapeTriangle v-else-if="icon === 'shape-triangle'" />
      <IconShapeHexagon v-else-if="icon === 'shape-hexagon'" />
      <IconShapeRoundSquare v-else-if="icon === 'shape-round-square'" />
      <IconShapeSquare v-else-if="icon === 'shape-square'" />
      <IconShapeCircle v-else-if="icon === 'shape-circle'" />
      <IconShapeArrow v-else-if="icon === 'shape-arrow'" />
      <IconShapeAuto v-else-if="icon === 'shape-auto'" />
      <IconShapeHeart v-else-if="icon === 'shape-heart'" />
      <IconShapeEmptyHeart v-else-if="icon === 'shape-empty-heart'" />
      <IconShapeRoundRect v-else-if="icon === 'shape-round-rect'" />
      <IconShapeRect v-else-if="icon === 'shape-rect'" />
      <IconShapePin v-else-if="icon === 'shape-pin'" />
      <IconShapeAirplane v-else-if="icon === 'shape-airplane'" />
      <IconHelp v-else />
    </n-icon>
    <span class="g-select-shape-item-text" :title="label">{{ label }}</span>
  </span>
</template>

<script lang='ts' setup>
import { NIcon } from 'naive-ui'
import {
  IconShapeDiamond,
  IconShapeTriangle,
  IconShapeHexagon,
  IconShapeRoundSquare,
  IconShapeSquare,
  IconShapeCircle,
  IconShapeArrow,
  IconShapeAuto,
  IconShapeHeart,
  IconShapeEmptyHeart,
  IconShapeRoundRect,
  IconShapeRect,
  IconShapePin,
  IconShapeAirplane,
  IconHelp,
} from '@/icons'

defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: String,
})
</script>
