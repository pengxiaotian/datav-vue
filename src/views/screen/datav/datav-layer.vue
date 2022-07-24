<template>
  <div
    :key="com.id"
    :style="sliderStyle"
    class="-datav-layer slider"
  >
    <div class="slider-wrap" :style="sliderWrapStyle">
      <div
        v-for="item in com.children"
        :key="item.id"
        class="slider-item"
        :style="getSliderItemStyle(item)"
      >
        <slot :data="item"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, CSSProperties } from 'vue'
import { DatavComponent } from '@/components/_models/datav-component'
import DatavGroup from '@/components/_internal/group'

const props = defineProps({
  com: {
    type: Object as PropType<DatavGroup>,
    required: true,
  },
})

const sliderStyle = computed(() => {
  const { attr } = props.com
  const style: CSSProperties = {
    'pointer-events': 'none',
    position: 'absolute',
    overflow: 'visible',
    width: `${attr.w}px`,
    height: `${attr.h}px`,
    opacity: attr.opacity,
    transform: `translate(${attr.x}px, ${attr.y}px)`,
  }

  return style
})

const sliderWrapStyle = computed(() => {
  const { attr } = props.com
  if (attr.apply3d) {
    return {
      width: '100%',
      height: '100%',
      perspective: `${attr.perspective}px`,
      'perspective-origin': `${attr.perspectiveOrigin.x}% ${attr.perspectiveOrigin.y}%`,
    }
  }

  return {
    width: '100%',
    height: '100%',
  }
})

const getRotate3d = (axis: string, deg: number) => {
  const isAxis = (axis1: string, axis2: string) => {
    return axis1 === axis2 ? 1 : 0
  }

  return `rotate3d(${isAxis(axis, 'x')}, ${isAxis(axis, 'y')}, ${isAxis(axis, 'z')}, ${deg}deg)`
}

const getSliderItemStyle = (item: DatavComponent) => {
  const { attr } = item
  const style: CSSProperties = {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'block',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    width: 'auto',
    height: 'auto',
    position: 'absolute',
    transformOrigin: `${attr.w / 2 + attr.x}px ${attr.h / 2 + attr.y}`,
  }

  if ( props.com.attr.apply3d) {
    const config = props.com.config.find(m => m.transform3d.id === item.id)
    const { rotate3d: r, scale3d: s, translate3d: t } = config.transform3d
    style.transform = `translate3d(${t.x}px, ${t.y}px, ${t.z}px) scale3d(${s.x}, ${s.y}, 1) ${getRotate3d(r.axis, r.deg)}`
  }
  return style
}
</script>
