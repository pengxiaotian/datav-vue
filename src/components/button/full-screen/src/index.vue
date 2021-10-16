<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div
      :style="btnStyle"
      @click="switchFullScreen"
      @mouseenter="isEnter = true"
      @mouseleave="isEnter = false"
    >
      <img :style="imgStyle" :src="imgSrc">
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { FullScreen } from './full-screen'

export default defineComponent({
  name: 'VFullScreen',
  props: {
    com: {
      type: Object as PropType<FullScreen>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const isEnter = ref(false)

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const btnStyle = computed(() => {
      return {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'user-select': 'none',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        borderRadius: `${config.value.borderRadius}%`,
        background: (isEnter.value || config.value.alwaysShow) ? config.value.bgColor : 'transparent',
      } as CSSProperties
    })

    const imgStyle = computed(() => {
      return {
        'user-select': 'none',
        width: `${attr.value.w * 0.6}px`,
        height: `${attr.value.h * 0.6}px`,
        display: (isEnter.value || config.value.alwaysShow) ? 'block' : 'none',
      } as CSSProperties
    })

    const imgSrc = computed(() => {
      if (isEnter.value || config.value.alwaysShow) {
        return document.fullscreenElement
          ? config.value.exit
          : config.value.request
      }
      return 'unknown'
    })

    const switchFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    }

    return {
      wrapperStyle,
      btnStyle,
      imgStyle,
      imgSrc,
      isEnter,
      switchFullScreen,
    }
  },
})
</script>
