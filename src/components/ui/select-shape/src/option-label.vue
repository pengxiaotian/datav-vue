<template>
  <span class="g-select-shape-item">
    <n-icon>
      <IconShapeDiamond v-if="icon === 'shape-diamond'" />
      <IconShapeTriangle v-else-if="icon === 'shape-triangle'" />
      <IconShapeHexagon v-else-if="icon === 'shape-hexagon'" />
      <IconShapeRoundSquare v-else-if="icon === 'shape-'" />
      <IconShapeSquare v-else-if="icon === 'shape-square'" />
      <IconShapeCircle v-else-if="icon === 'shape-circle'" />
      <IconShapeArrow v-else-if="icon === 'shape-arrow'" />
      <IconShapeAuto v-else-if="icon === 'shape-auto'" />
      <IconShapeHeart v-else-if="icon === 'shape-heart'" />
      <IconShapeEmptyHeart v-else-if="icon === 'shape-empty-heart'" />
      <IconShapeRoundRect v-else-if="icon === 'shape-round-rect'" />
      <IconShapeRect v-else-if="icon === 'shape-rect'" />
      <IconHelp v-else />
    </n-icon>
    <span class="g-select-shape-item-text" :title="label">{{ label }}</span>
  </span>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
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
  IconHelp,
} from '@/icons'

export default defineComponent({
  name: 'OptionLabel',
  components: {
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
    IconHelp,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
})
</script>
