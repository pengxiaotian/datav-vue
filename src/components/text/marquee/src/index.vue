<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div class="datav-marquee" style="white-space: nowrap; overflow: hidden;">
      <div ref="marqueeRef" :style="textStyle">
        <div
          :style="{
            display: 'inline-block',
            'min-width': `${textWidth}px`
          }"
        >
          {{ titleText }}<i style="display: inline-block; width: 80px;"></i>
        </div>
        <div
          :style="{
            display: 'inline-block',
            'min-width': `${textWidth}px`
          }"
        >
          {{ titleText }}<i style="display: inline-block; width: 80px;"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, ref, shallowRef, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import gsap from 'gsap'
import { useDataCenter, getFieldMap } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { Marquee } from './marquee'

export default defineComponent({
  name: 'VMarquee',
  props: {
    com: {
      type: Object as PropType<Marquee>,
      required: true,
    },
  },
  setup(props) {
    const apiStore = useApiStore()
    useDataCenter(props.com)

    const dv_data = computed(() => {
      return apiStore.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const marqueeRef = ref(null)
    const textWidth = ref(0)
    const transform = ref(0)
    const tween = shallowRef<gsap.core.Tween>(null)

    const wrapperStyle = computed(() => {
      const { textStyle } = config.value
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        fontFamily: `${textStyle.fontFamily}, Arial, sans-serif`,
        fontSize: `${textStyle.fontSize}px`,
        color: textStyle.color,
        'font-weight': textStyle.fontWeight,
      } as CSSProperties
    })

    const textStyle = computed(() => {
      return {
        display: 'inline-block',
        transform: `translateX(-${transform.value}px)`,
        transition: 'none 0s ease 0s',
      }
    })

    const titleText = computed(() => {
      return dv_data.value[dv_field.value.value] || ''
    })

    const doMarquee = () => {
      if (!config.value.loop) {
        return
      }

      nextTick(() => {
        const { ifSpeed, speed, duration, timeout } = config.value
        if (marqueeRef.value) {
          textWidth.value = marqueeRef.value.offsetWidth / 2
        }

        if (textWidth.value > attr.value.w) {
          const time = ifSpeed ? speed / 100 * textWidth.value : duration
          tween.value = gsap.fromTo(transform, {
            value: 0,
          }, {
            value: textWidth.value,
            duration: time / 1000,
            ease: 'none',
            repeatDelay: timeout / 1000,
            repeat: Infinity,
          })
        } else {
          stopMarquee()
        }
      })
    }

    const stopMarquee = () => {
      tween.value?.kill()
      textWidth.value = attr.value.w
      transform.value = 0
    }

    watch([config, titleText], () => {
      stopMarquee()
      doMarquee()
    }, {
      deep: true,
    })

    onMounted(() => {
      doMarquee()
    })

    onUnmounted(() => {
      stopMarquee()
    })

    return {
      marqueeRef,
      wrapperStyle,
      textStyle,
      titleText,
      textWidth,
    }
  },
})
</script>
