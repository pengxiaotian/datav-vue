<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div class="bg-inner" style="background: none; width: 100%; height: 100%;"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { BorderBox, presetImages } from './border-box'

export default defineComponent({
  name: 'VBorderBox',
  props: {
    com: {
      type: Object as PropType<BorderBox>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wraperStyle = computed(() => {
      const style = {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        'border-radius': 0,
        'border-style': 'solid',
        'border-width': `1px`,
        background: 'none',
      }
      const img = presetImages.find(m => m.id === config.value.boxStyle.style)
      if (img) {
        style['border-image'] = `url(${img.src}) ${img.border.slice} / ${img.border.width} / ${img.border.outset} ${img.border.repeat}`
      }
      return style
    })

    return {
      wraperStyle,
    }
  },
})
</script>
