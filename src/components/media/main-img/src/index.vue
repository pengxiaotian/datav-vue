<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <a
      v-if="config.urlConfig.url"
      :href="config.urlConfig.url"
      :target="config.urlConfig.ifBlank ? '_blank' : '_self'"
      style="display: block; width: 100%; height: 100%;"
    ></a>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { MainImg } from './main-img'

export default defineComponent({
  name: 'VMainImg',
  props: {
    com: {
      type: Object as PropType<MainImg>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wrapperStyle = computed(() => {
      const isVector = config.value.imageType === 'vector'
      let background = `url(${config.value.backgroundImage}) 0% 0% / `
      let maskSize = ''
      if (config.value.repeat === 'repeat') {
        background += 'auto repeat'
        maskSize = 'auto'
      } else if (config.value.repeat === 'repeat-x') {
        background += 'auto 100% repeat-x'
        maskSize = 'auto 100%'
      } else if (config.value.repeat === 'repeat-y') {
        background += '100% repeat-y'
        maskSize = '100%'
      } else {
        background += '100% 100% no-repeat'
        maskSize = '100% 100%'
      }
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        'image-rendering': '-webkit-optimize-contrast',
        background: isVector ? config.value.vectorFill : background,
        '-webkit-mask-image': isVector ? `url(${config.value.vectorImage})` : 'none',
        '-webkit-mask-repeat': isVector ? config.value.repeat : 'initial',
        '-webkit-mask-size': isVector ? maskSize : 'initial',
        'border-radius': `${config.value.radius}px`,
        cursor: config.value.cursor ? 'pointer' : 'default',
      } as CSSProperties
    })

    return {
      config,
      wrapperStyle,
    }
  },
})
</script>
