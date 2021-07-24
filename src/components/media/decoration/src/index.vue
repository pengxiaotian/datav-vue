<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div :style="imgBoxStyle"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { Decoration, presetImages } from './decoration'

export default defineComponent({
  name: 'VDecoration',
  props: {
    com: {
      type: Object as PropType<Decoration>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wraperStyle = computed(() => {
      return {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const imgBoxStyle = computed(() => {
      const gif = presetImages[config.value.global.img]
      return {
        width: '100%',
        height: '100%',
        opacity: config.value.global.opacity,
        'background-image': `url(${gif.url})`,
        'background-size': '100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        ...gif.css,
      }
    })

    return {
      wraperStyle,
      imgBoxStyle,
    }
  },
})
</script>
