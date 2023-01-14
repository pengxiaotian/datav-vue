<template>
  <div class="rotate" :style="rotateStyle">
    <span v-if="config.index.show" class="table-index" :style="indexStyle">
      {{ serialNum }}
    </span>
    <div ref="contentRef" class="table-content" :style="contentStyle">
      <div class="inner" :style="marqueeStyle">
        <span ref="marqueeRef">{{ data.content }}</span>
        <template v-if="config.content.marquee.show && showMarquee">
          <i style="display: inline-block; width: 80px;"></i>
          <span>{{ data.content }}</span>
        </template>
      </div>
    </div>
    <div v-if="config.number.show" class="number" :style="numberStyle">
      {{ config.number.symbol.prefix }}<span
        :style="{
          'margin-left': config.number.symbol.marginLeft + 'px',
          'margin-right': config.number.symbol.marginRight + 'px',
        }"
      >
        {{ viewNumber }}
      </span>{{ config.number.symbol.suffix }}
    </div>
  </div>
  <div v-if="config.bar.show" class="table-bar" :style="barStyle">
    <div class="light" :style="lightStyle"></div>
  </div>
  <div class="line-segment" :style="segmentStyle">
    <div v-if="!config.bar.show" class="light" :style="lightStyle"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, watch, nextTick, inject, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import gsap from 'gsap'
import Accounting from 'accounting'
import { TableBar } from '../table-bar'
import { TableBarDto, tableBarInjectionKey } from '../context'

const props = defineProps<{
  config: TableBar['config']
  data: TableBarDto
  index: number
  tableWidth: number
}>()

const { pageIndex, maxNum, watchFlag } = inject(tableBarInjectionKey)

const contentRef = ref(null)
const marqueeRef = ref(null)
const showMarquee = ref(false)
const marqueeTransform = ref(0)
const marqueeTween = shallowRef<gsap.core.Tween>(null)

const lightTransform = ref(0)
const lightTween = shallowRef<gsap.core.Tween>(null)

const flipTransform = ref(0)
const flipTween = shallowRef<gsap.core.Tween>(null)

const serialNum = computed(() => {
  const { global, index } = props.config
  const no = props.index + (pageIndex.value - 1) * global.quantity + 1
  return index.format === '2'
    ? `NO.${no}` : index.format === '3'
      ? `(${no})` : no
})

const viewNumber = computed(() => {
  const { number } = props.config
  if (!number.show) {
    return ''
  }

  let { value } = props.data
  let valueStr = '0'
  if (number.percentage) {
    if (maxNum.value !== 0) {
      value = value / maxNum.value * 100
    }
    valueStr = Accounting.toFixed(value, number.decimal)
  } else {
    valueStr = Accounting.toFixed(value, number.decimal)
    valueStr = number.separatingChart
      ? number.decimal === 0
        ? valueStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        : valueStr.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      : valueStr
  }

  return valueStr
})

const rotateStyle = computed(() => {
  const { textarea } = props.config.content
  return {
    display: 'flex',
    'align-items': 'center',
    'margin-bottom': `${props.config.global.padding}px`,
    position: 'relative',
    width: '100%',
    'transform-style': 'preserve-3d',
    'transform-origin': '50% 50% 0px',
    'will-change': 'transform',
    height: `${Math.max(textarea.fontSize + 8, 20)}px`,
    transform: `rotateX(${flipTransform.value}deg) translateZ(0px)`,
    // 'backface-visibility': 'hidden',
  } as CSSProperties
})

const indexStyle = computed(() => {
  const { textarea, width, padding } = props.config.index
  return {
    flex: 'none',
    width,
    color: textarea.color,
    'font-weight': textarea.fontWeight,
    'font-size': `${textarea.fontSize}px`,
    'padding-right': `${padding}px`,
  } as CSSProperties
})

const contentStyle = computed(() => {
  const { textarea, marquee } = props.config.content
  let style = {
    position: 'relative',
    display: 'flex',
    'vertical-align': 'bottom',
    'font-size': `${textarea.fontSize}px`,
    'font-weight': textarea.fontWeight,
    color: textarea.color,
    overflow: 'auto',
    flex: 'auto',
    whiteSpace: 'normal',
  }

  if (marquee.show) {
    style.overflow = 'hidden'
    style.whiteSpace = 'nowrap'
  }

  return style as CSSProperties
})

const marqueeStyle = computed(() => {
  if (props.config.content.marquee.show) {
    return {
      position: 'relative',
      left: '0px',
      transform: `translateX(-${marqueeTransform.value}px)`,
      transition: 'none 0s ease 0s',
    } as CSSProperties
  }
  return {}
})

const numberStyle = computed(() => {
  const { number } = props.config
  return {
    'white-space': 'nowrap',
    'font-weight': number.fontWeight,
    'font-size': `${number.fontSize}px`,
    color: number.color,
    'padding-left': `${number.padding}px`,
  } as CSSProperties
})

const barStyle = computed(() => {
  const { bar } = props.config
  const { threshold } = bar
  const v = maxNum.value === 0 ? 0 : props.data.value / maxNum.value * 100
  const color = (threshold.show && v > threshold.value) ? threshold : bar
  return {
    display: 'inline-block',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: `${v}%`,
    height: `${bar.height}px`,
    'z-index': 1,
    'border-radius': `${bar.radius}px`,
    background: color.fillColorType === 'gradient'
      ? `linear-gradient(to left, ${color.fromColor}, ${color.toColor})`
      : color.color,
  } as CSSProperties
})

const lightStyle = computed(() => {
  const { width, height, color } = props.config.light
  return {
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: `${width}px`,
    height: `${height}px`,
    background: `radial-gradient(${color} 5%, rgba(0, 0, 0, 0) 80%)`,
    transform: `translateX(${lightTransform.value || -width}px)`,
    transition: 'none 0s ease 0s',
  } as CSSProperties
})

const segmentStyle = computed(() => {
  const { segment, global, bar, light } = props.config
  return {
    display: segment.show ? 'block' : 'none',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: `${light.show ? segment.height : 0}px`,
    background: segment.color,
    'margin-bottom': `${global.padding}px`,
    'border-radius': `${bar.radius}px`,
    'border-bottom': bar.show ? 'none' : `1px solid ${segment.color}`,
  } as CSSProperties
})

// ------ marquee ------
const doMarquee = () => {
  const { show, duration } = props.config.content.marquee
  if (!show) {
    return
  }

  nextTick(() => {
    let contentWidth = 0
    let textWidth = 0

    if (contentRef.value) {
      contentWidth = contentRef.value.offsetWidth
    }

    if (marqueeRef.value) {
      textWidth = marqueeRef.value.offsetWidth
    }

    showMarquee.value = textWidth > contentWidth
    if (showMarquee.value) {
      marqueeTween.value = gsap.fromTo(marqueeTransform, {
        value: 0,
      }, {
        value:  textWidth + 80,
        duration: duration / 1000,
        ease: 'none',
        repeatDelay: 0.5,
        repeat: Infinity,
      })
    } else {
      stopMarquee()
    }
  })
}

const stopMarquee = () => {
  marqueeTween.value?.kill()
  marqueeTransform.value = 0
}

// ------ light ------
const doLight = () => {
  const { global, light } = props.config
  if (!light.show) {
    return
  }

  lightTween.value = gsap.fromTo(lightTransform, {
    value: -light.width,
  }, {
    value: props.tableWidth,
    duration: global.duration / 1000,
    delay: props.index * 0.15,
    ease: 'power1.out',
    repeatDelay: light.duration / 1000,
    repeat: Infinity,
  })
}

const stopLight = () => {
  lightTween.value?.kill()
  lightTransform.value = 0
}

// ------ flip ------
const doFlip = () => {
  const { global } = props.config
  if (!global.loop || !global.animation) {
    return
  }

  flipTween.value = gsap.to(flipTransform, {
    ease: 'power4.inOut',
    keyframes: [
      {
        value: -90,
        duration: 0.75,
        onStart() {
          stopMarquee()
          stopLight()
        },
      },
      { value: 90, duration: 0 },
      {
        value: 0,
        duration: 0.5,
        onComplete() {
          doMarquee()
          doLight()
        },
      },
    ],
    delay: props.index * 0.1,
    repeatDelay: global.looptime / 1000,
    repeat: Infinity,
  })
}

const stopFlip = () => {
  flipTween.value?.kill()
  flipTransform.value = 0
}

watch(watchFlag, () => {
  stopFlip()
  stopMarquee()
  stopLight()

  doFlip()
}, {
  immediate: true,
})

onUnmounted(() => {
  stopFlip()
  stopMarquee()
  stopLight()
})
</script>
