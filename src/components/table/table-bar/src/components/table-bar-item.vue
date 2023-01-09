<template>
  <div>
    <div class="rotate" :style="rotateStyle">
      <span v-if="config.index.show" class="table-index" :style="indexStyle">
        {{ viewIndex }}
      </span>
      <div ref="tablecontentRef" class="table-content" :style="contentStyle">
        <div
          ref="tableinnerRef"
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
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import Accounting from 'accounting'
import { TableBar } from '../table-bar'
import { TableBarDto } from '../context'

const props = defineProps<{
  config: TableBar['config']
  bar: TableBarDto
  index: number
  serialNum: number
  maxValue: number
  flag: number
  tableWidth: number
}>()

const emits = defineEmits(['lastCompleted'])

const marquee = ref({
  timerID: -1,
  content: props.bar.content,
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
  transform: '',
  transition: 'transform 500ms ease-in-out 0s',
})

const tableinnerRef = ref(null)
const tablecontentRef = ref(null)

const viewIndex = computed(() => {
  return props.config.index.prefix + (props.serialNum + 1) + props.config.index.suffix
})

const realNumber = computed(() => {
  if (!props.config.number.show) {
    return ''
  }

  let value = props.bar.value || 0
  let valueStr = '0'
  if (props.config.number.real) {
    if (props.config.number.divisor !== 0) {
      value /= props.config.number.divisor
    }
    valueStr = Accounting.toFixed(value, props.config.number.decimal)
    valueStr = props.config.number.separatingChart
      ? props.config.number.decimal === 0
        ? valueStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        : valueStr.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      : valueStr
  } else {
    if (props.maxValue !== 0) {
      value = value / props.maxValue * 100
    }
    valueStr = Accounting.toFixed(value, props.config.number.decimal)
  }
  return props.config.number.prefix + valueStr + props.config.number.suffix
})

const rotateStyle = computed(() => {
  let h = 8 + props.config.content.textarea.fontSize
  return {
    display: 'flex',
    'align-items': 'center',
    position: 'relative',
    'transform-style': 'preserve-3d',
    'transform-origin': '50% 50% 0px',
    width: '100%',
    'backface-visibility': 'hidden',
    height: `${h > 24 ? h : 24  }px`,
    'margin-bottom': `${props.config.content.padding  }px`,
    transform: rotate.value.transform,
    transition: rotate.value.transition,
  } as CSSProperties
})

const indexStyle = computed(() => {
  return {
    width: 'auto',
    flex: 'none',
    'font-weight': props.config.index.textarea.fontWeight,
    'font-size': `${props.config.index.textarea.fontSize  }px`,
    color: props.config.index.textarea.color,
    'padding-right': `${props.config.index.padding  }px`,
  } as CSSProperties
})

const contentStyle = computed(() => {
  let style = {
    position: 'relative',
    display: 'flex',
    flex: 'auto',
    'vertical-align': 'bottom',
    overflow: 'auto',
    'white-space': 'normal',
    'font-weight': props.config.content.textarea.fontWeight,
    'font-size': `${props.config.content.textarea.fontSize  }px`,
    color: props.config.content.textarea.color,
  }
  if (props.config.content.marquee.show) {
    style['overflow'] = 'hidden'
    style['white-space'] = 'nowrap'
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
  return {
    'white-space': 'nowrap',
    'font-weight': props.config.number.fontWeight,
    'font-size': `${props.config.number.fontSize  }px`,
    color: props.config.number.color,
    'padding-left': `${props.config.number.padding  }px`,
  } as CSSProperties
})

const barStyle = computed(() => {
  let v = props.maxValue === 0
    ? 0 : props.bar.value / props.maxValue * 100
  let color = v > props.config.bar.threshold.value
    ? props.config.bar.threshold : props.config.bar
  return {
    display: 'inline-block',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: `${v  }%`,
    height: `${props.config.bar.height  }px`,
    'border-radius': `${props.config.bar.radius  }px`,
    background: `linear-gradient(${color.fromColor}, ${color.toColor})`,
  } as CSSProperties
})

const lightStyle = computed(() => {
  return {
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: `${props.config.light.width  }px`,
    height: `${props.config.light.height  }px`,
    background: `radial-gradient(${props.config.light.color} 5%, rgba(0, 0, 0, 0) 80%)`,
    transform: light.value.transform,
    transition: light.value.transition,
  } as CSSProperties
})

const segmentStyle = computed(() => {
  return {
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    'border-radius': `${props.config.bar.radius  }px`,
    height: `${props.config.segment.height  }px`,
    background: props.config.segment.color,
    'margin-bottom': `${props.config.global.padding  }px`,
  } as CSSProperties
})

const showMarquee = () => {
  nextTick(() => {
    if (marquee.value.width === 0) {
      if (tableinnerRef.value) {
        marquee.value.width = tableinnerRef.value.offsetWidth
      }
    }
    let len2 = 0
    if (tablecontentRef.value) {
      len2 = tablecontentRef.value.offsetWidth
    }
    if (marquee.value.width > len2) {
      marquee.value.content = `${props.bar.content}<i style="display:inline-block;width:80px;"></i>${props.bar.content}`
      marquee.value.transform = `translateX(-${marquee.value.width + 80}px)`
      marquee.value.transition = `transform ${props.config.content.marquee.duration}ms linear 0s`
      marquee.value.timerID = window.setTimeout(() => {
        marquee.value.transform = ''
        marquee.value.transition = ''
        marquee.value.show = !marquee.value.show
        showMarquee()
      }, props.config.content.marquee.duration)
    } else {
      marquee.value.content = props.bar.content
    }
  })
}

const showLight = () => {
  let v = 0
  if (props.maxValue !== 0) {
    v = props.bar.value / props.maxValue * props.tableWidth + 20
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
    marquee.value.content = props.bar.content
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
    marquee.value.content = props.bar.content
  }
})

watch(() => props.flag, () => {
  showRotate1()
})

onMounted(() => {
  if (props.config.content.marquee.show) {
    showMarquee()
  }
  if (props.config.light.show) {
    showLight()
  }
  showRotate1()
})
</script>
