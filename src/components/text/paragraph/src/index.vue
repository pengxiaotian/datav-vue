<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div :style="bigContentStyle">
      <div ref="contentRef" :style="contentStyle">
        {{ contentText }}
      </div>
      <div v-if="config.scroll.overScroll" :style="contentStyle">
        {{ contentText }}
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
import { Paragraph } from './paragraph'

export default defineComponent({
  name: 'VParagraph',
  props: {
    com: {
      type: Object as PropType<Paragraph>,
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

    const contentRef = ref(null)
    const transform = ref('')
    const transition = ref('')
    const height = ref(0)
    const timeId = ref(0)

    const wrapperStyle = computed(() => {
      return {
        overflow: 'hidden',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const bigContentStyle = computed(() => {
      return {
        transform: transform.value,
        transition: transition.value,
      }
    })

    const contentStyle = computed(() => {
      return {
        'font-family': `${config.value.textStyle.fontFamily}, Arial, sans-serif`,
        'font-size': `${config.value.textStyle.fontSize}px`,
        color: config.value.textStyle.color,
        'font-weight': config.value.textStyle.fontWeight,
        'text-align': config.value.textAlign,
        'line-height': `${config.value.lineHeight}px`,
        'text-indent': `${config.value.textIndent}px`,
        'min-height': `${height.value}px`,
      } as CSSProperties
    })

    const contentText = computed(() => {
      return dv_data.value[dv_field.value.value] || config.value.content
    })

    const doMarquee = () => {
      nextTick(() => {
        if (contentRef.value) {
          height.value = contentRef.value.offsetHeight
        }
        if (height.value > attr.value.h) {
          transform.value = `translateY(-${height.value}px)`
          transition.value = `transform ${config.value.scroll.duration}ms linear 0s`
          timeId.value = window.setTimeout(() => {
            transform.value = 'translateY(0)'
            transition.value = 'none 0s ease 0s'
            if (config.value.scroll.overScroll) {
              doMarquee()
            }
          }, config.value.scroll.duration)
        } else {
          height.value = attr.value.h
          transform.value = 'translateY(0)'
          transition.value = 'none 0s ease 0s'
        }
      })
    }

    const debouncedDoMarquee = debounce(doMarquee, 500)

    watch([wrapperStyle, () => config.value.scroll.overScroll], () => {
      clearTimeout(timeId.value)
      height.value = attr.value.h
      transform.value = 'translateY(0)'
      transition.value = 'none 0s ease 0s'
      debouncedDoMarquee()
    })

    onMounted(() => {
      debouncedDoMarquee()
    })

    onUnmounted(() => {
      clearTimeout(timeId.value)
    })

    return {
      contentRef,
      config,
      wrapperStyle,
      bigContentStyle,
      contentStyle,
      contentText,
    }
  },
})
</script>
