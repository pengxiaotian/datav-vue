<template>
  <div>
    <div class="rotate" :style="rotateStyle">
      <span v-if="config.index.show" class="table-index" :style="indexStyle">
        {{ viewIndex }}
      </span>
      <div ref="contentRef" class="table-content" :style="contentStyle">
        <div
          ref="marqueeRef"
          class="inner"
          :style="marqueeStyle"
          v-html="marquee.content"
        ></div>
      </div>
      <div v-if="config.number.show" class="number" :style="numberStyle">
        {{ realNumber }}
      </div>
    </div>
    <div v-if="config.bar.show" class="table-bar" :style="barStyle">
      <div class="light" :style="lightStyle"></div>
    </div>
    <div v-if="config.segment.show" class="line-segment" :style="segmentStyle"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick, inject } from 'vue'
import type { CSSProperties } from 'vue'
import Accounting from 'accounting'
import { TableBar } from '../table-bar'
import { TableBarDto, tableBarInjectionKey } from '../context'

const props = defineProps<{
  config: TableBar['config']
  data: TableBarDto
  index: number
  tableWidth: number
}>()

const emits = defineEmits(['lastCompleted'])

const { pageIndex, maxNum, watchFlag } = inject(tableBarInjectionKey)

const marquee = ref({
  timerID: -1,
  content: props.data.content,
  transform: '',
  transition: '',
  width: 0,
  show: true,
})

const light = ref({
  timerID1: -1,
  timerID2: -1,
  transform: `translateX(-${props.config.light.width}px)`,
  transition: 'none 0s ease 0s',
})

const rotate = ref({
  transform: 'rotateX(0deg) translateZ(0px)',
  transition: 'transform 500ms ease-in-out 0s',
})

const marqueeRef = ref(null)
const contentRef = ref(null)

const viewIndex = computed(() => {
  return props.index + (pageIndex.value - 1) * props.config.global.quantity + 1
})

const realNumber = computed(() => {
  const { number } = props.config
  if (!number.show) {
    return ''
  }

  let { value } = props.data
  let valueStr = '0'
  if (number.percentage) {
    valueStr = Accounting.toFixed(value, number.decimal)
    valueStr = number.separatingChart
      ? number.decimal === 0
        ? valueStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        : valueStr.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      : valueStr
  } else {
    if (maxNum.value !== 0) {
      value = value / maxNum.value * 100
    }
    valueStr = Accounting.toFixed(value, number.decimal)
  }

  return number.symbol.prefix + valueStr + number.symbol.suffix
})

const rotateStyle = computed(() => {
  const { textarea, padding } = props.config.content
  return {
    display: 'flex',
    'align-items': 'center',
    'margin-bottom': `${padding}px`,
    position: 'relative',
    width: '100%',
    height: `${Math.max(textarea.fontSize + 8, 20)}px`,
    'transform-style': 'preserve-3d',
    'transform-origin': '50% 50% 0px',
    transform: rotate.value.transform,
    transition: rotate.value.transition,
    'will-change': 'transform',
    // 'backface-visibility': 'hidden',
  } as CSSProperties
})

const indexStyle = computed(() => {
  const { textarea, padding } = props.config.index
  return {
    width: 'auto',
    flex: 'none',
    'font-weight': textarea.fontWeight,
    'font-size': `${textarea.fontSize}px`,
    color: textarea.color,
    'padding-right': `${padding}px`,
  } as CSSProperties
})

const contentStyle = computed(() => {
  const { textarea, marquee } = props.config.content
  let style = {
    position: 'relative',
    overflow: 'auto',
    display: 'flex',
    flex: 'auto',
    whiteSpace: 'normal',
    'vertical-align': 'bottom',
    'font-weight': textarea.fontWeight,
    'font-size': `${textarea.fontSize}px`,
    color: textarea.color,
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
      left: '0px',
      position: 'relative',
      transform: marquee.value.transform,
      transition: marquee.value.transition,
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
  const v = maxNum.value === 0 ? 0 : props.data.value / maxNum.value * 100
  const color = v > props.config.bar.threshold.value
    ? props.config.bar.threshold
    : props.config.bar
  return {
    display: 'inline-block',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: `${v}%`,
    height: `${props.config.bar.height}px`,
    'border-radius': `${props.config.bar.radius}px`,
    background: `linear-gradient(${color.fromColor}, ${color.toColor})`,
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
    transform: light.value.transform,
    transition: light.value.transition,
  } as CSSProperties
})

const segmentStyle = computed(() => {
  const { bar, segment, global } = props.config
  return {
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    'border-radius': `${bar.radius}px`,
    height: `${segment.height}px`,
    background: segment.color,
    'margin-bottom': `${global.padding}px`,
  } as CSSProperties
})

const showMarquee = () => {
  nextTick(() => {
    if (marquee.value.width === 0) {
      if (marqueeRef.value) {
        marquee.value.width = marqueeRef.value.offsetWidth
      }
    }
    let len2 = 0
    if (contentRef.value) {
      len2 = contentRef.value.offsetWidth
    }
    if (marquee.value.width > len2) {
      marquee.value.content = `${props.data.content}<i style="display:inline-block;width:80px;"></i>${props.data.content}`
      marquee.value.transform = `translateX(-${marquee.value.width + 80}px)`
      marquee.value.transition = `transform ${props.config.content.marquee.duration}ms linear 0s`
      marquee.value.timerID = window.setTimeout(() => {
        marquee.value.transform = ''
        marquee.value.transition = ''
        marquee.value.show = !marquee.value.show
        showMarquee()
      }, props.config.content.marquee.duration)
    } else {
      marquee.value.content = props.data.content
    }
  })
}

const showLight = () => {
  let v = 0
  if (maxNum.value !== 0) {
    v = props.data.value / maxNum.value * props.tableWidth + 20
  }
  light.value.transform = `translateX(${v}px)`
  light.value.transition = `transform ${props.config.global.duration + 100}ms ease-in-out 0s`
  clearTimeout(light.value.timerID1)
  clearTimeout(light.value.timerID2)
  light.value.timerID1 = window.setTimeout(() => {
    light.value.transform = `translateX(-${props.config.light.width}px)`
    light.value.transition = 'none 0s ease 0s'
    light.value.timerID2 = window.setTimeout(showLight, props.config.light.duration)
  }, props.config.global.duration + 100)
}

const showRotate1 = () => {
  window.setTimeout(() => {
    rotate.value.transform = 'rotateX(-360deg)'
    rotate.value.transition = 'transform 500ms cubic-bezier(0.55, 0.18, 0.92, 0.46) 0s'
    showRotate2()
  }, props.index * 100)
}

const showRotate2 = () => {
  setTimeout(() => {
    rotate.value.transform = 'rotateX(0deg)'
    rotate.value.transition = 'none 0s ease 0s'

    clearTimeout(marquee.value.timerID)
    marquee.value.width = 0
    marquee.value.content = props.data.content
    marquee.value.transform = ''
    marquee.value.transition = ''
    marquee.value.show = !marquee.value.show

    clearTimeout(light.value.timerID1)
    clearTimeout(light.value.timerID2)
    light.value.transform = `translateX(-${props.config.light.width}px)`
    light.value.transition = 'none 0s ease 0s'

    if (props.config.content.marquee.show || props.config.light.show) {
      setTimeout(() => {
        if (props.config.content.marquee.show) {
          showMarquee()
        }
        if (props.config.light.show) {
          showLight()
        }
      }, 500)
    }

    emits('lastCompleted', props.index)
  }, 600)
}

watch(() => props.config.content.marquee.show, nv => {
  if (!nv) {
    marquee.value.content = props.data.content
  }
})

watch(watchFlag, () => {
  // showRotate1()
})

onMounted(() => {
  if (props.config.content.marquee.show) {
    showMarquee()
  }
  // if (props.config.light.show) {
  //   showLight()
  // }
  // showRotate1()
})
</script>
