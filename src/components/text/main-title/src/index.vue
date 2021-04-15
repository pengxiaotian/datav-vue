<template>
  <div v-if="urlText" class="com-wrapper" :style="titleStyle">
    <a :href="urlText" :target="urlTarget" :style="urlStyle">
      {{ titleText }}
    </a>
  </div>
  <div v-else class="com-wrapper" :style="titleStyle">
    {{ titleText }}
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import MainTitle from '@/domains/text/main-title'

export default defineComponent({
  name: 'VMainTitle',
  props: {
    com: {
      type: Object as PropType<MainTitle>,
      required: true,
    },
  },
  setup(props) {
    const titleStyle = computed(() => ({
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
      opacity: props.com.attr.opacity,
      'font-family': `${props.com.config.textStyle.fontFamily}, Arial, sans-serif`,
      'font-size': `${props.com.config.textStyle.fontSize}px`,
      'font-weight': props.com.config.textStyle.fontWeight,
      color: props.com.config.textStyle.color,
      'justify-content': props.com.config.textAlign,
      'writing-mode': props.com.config.writingMode,
      display: 'flex',
      overflow: 'hidden',
      'align-items': 'center',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    }))

    const urlStyle = computed(() => ({
      color: props.com.config.textStyle.color,
      'text-decoration': 'none',
    }))

    const titleText = computed(() => {
      return props.com.config.title
    })

    const urlText = computed(() => {
      return props.com.config.urlConfig.url
    })

    const urlTarget = computed(() => props.com.config.urlConfig.isBlank ? '_blank' : '_self')

    return {
      titleStyle,
      urlStyle,
      titleText,
      urlText,
      urlTarget,
    }
  },
})
</script>
