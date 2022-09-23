<template>
  <div class="datav-wrapper cursor-pointer" :style="wrapperStyle">
    <div
      :style="btnStyle"
      class="select-none flex items-center justify-center"
      @click="switchFullScreen"
      @mouseenter="isEnter = true"
      @mouseleave="isEnter = false"
    >
      <img
        :style="imgStyle"
        :src="imgSrc"
        class="select-none"
      >
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, toRef, ref, defineProps } from 'vue'
import type { CSSProperties } from 'vue'
import type { FullScreen } from './full-screen'

type Props = {
  com: FullScreen
}

const props = defineProps<Props>()

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
    width: `${attr.value.w}px`,
    height: `${attr.value.h}px`,
    borderRadius: `${config.value.borderRadius}%`,
    background: (isEnter.value || config.value.alwaysShow) ? config.value.bgColor : 'transparent',
  } as CSSProperties
})

const imgStyle = computed(() => {
  return {
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
</script>

<script lang="ts">
export default {
  name: 'VFullScreen',
}
</script>
