<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div
      ref="marqueeRef"
      style="white-space: nowrap; overflow: hidden;"
    >
      <div
        ref="marqueeTextRef"
        :style="textStyle"
        v-html="content"
      >
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import { debounce } from 'lodash-es'
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
    const marqueeTextRef = ref(null)
    const transform = ref('')
    const transition = ref('')
    const width = ref(0)
    const timeId1 = ref(0)
    const timeId2 = ref(0)

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        fontFamily: `${config.value.textStyle.fontFamily}, Arial, sans-serif`,
        fontSize: `${config.value.textStyle.fontSize}px`,
        color: config.value.textStyle.color,
        'font-weight': config.value.textStyle.fontWeight,
      } as CSSProperties
    })

    const textStyle = computed(() => {
      return {
        display: 'inline-block',
        transform: transform.value,
        transition: transition.value,
      }
    })

    const titleText = computed(() => {
      return dv_data.value[dv_field.value.value] || ''
    })

    const content = computed(() => {
      let c = `<div style="display: inline-block;min-width: ${width.value}px">${titleText.value}<i style="display:inline-block; width:80px;"></i></div>`
      return c + c
    })

    const doMarquee = () => {
      nextTick(() => {
        if (marqueeTextRef.value) {
          width.value = marqueeTextRef.value.offsetWidth / 2
        }
        if (width.value > attr.value.w) {
          let t = 0
          if (config.value.ifSpeed) {
            t = config.value.speed / 100 * width.value
          } else {
            t = config.value.duration
          }
          transform.value = `translateX(-${width.value}px)`
          transition.value = `transform ${t}ms linear 0s`
          timeId1.value = setTimeout(
            () => {
              transform.value = 'translateX(0)'
              transition.value = 'none 0s ease 0s'
              if (config.value.loop) {
                if (config.value.timeout > 0) {
                  timeId2.value = setTimeout(doMarquee, config.value.timeout) as any
                } else {
                  doMarquee()
                }
              }
            }, t) as any
        } else {
          width.value = attr.value.w
          transform.value = 'translateX(0)'
          transition.value = 'none 0s ease 0s'
        }
      })
    }

    const debouncedDoMarquee = debounce(doMarquee, 500)

    watch([wrapperStyle, titleText], () => {
      clearTimeout(timeId1.value)
      clearTimeout(timeId2.value)
      width.value = attr.value.w
      transform.value = 'translateX(0)'
      transition.value = 'none 0s ease 0s'
      debouncedDoMarquee()
    })

    onMounted(() => {
      debouncedDoMarquee()
    })

    onUnmounted(() => {
      clearTimeout(timeId1.value)
      clearTimeout(timeId2.value)
    })

    return {
      marqueeRef,
      marqueeTextRef,
      wrapperStyle,
      textStyle,
      content,
    }
  },
})
</script>
