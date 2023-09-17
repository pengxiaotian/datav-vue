<template>
  <div class="datav-gui g-color-mapping">
    <div class="g-color-mapping-header">
      <n-tooltip placement="top">
        <template #trigger>
          <n-icon
            :component="data.mapping ? IconConnect : IconDisconnect"
            class="g-color-mapping-show"
            @click="data.mapping = !data.mapping"
          />
        </template>
        {{ data.mapping ? '关闭' : '开启' }}视觉映射
      </n-tooltip>
      <div class="g-field-title">{{ label }}</div>
      <div class="g-color-mapping-header-right">
        <template v-if="data.mapping">
          <SchemeSelectPopover
            v-if="!showPanel"
            :value="data.scale.scheme"
            :colors="viewColors"
            :preset-colors="presetColors"
            is-preset
            @update:value="selectPresetColor"
          />
          <n-icon
            :component="IconArrowRight"
            class="--arrow"
            :style="`transform: rotate(${showPanel ? '90deg' : '0'})`"
            @click="toggleShowPanel"
          />
        </template>
        <div v-else class="g-color-mapping-fixed">
          <n-input :value="data.fixed.value" :size="size" />
          <n-color-picker
            :value="data.fixed.value"
            :size="size"
            show-alpha
            :style="{
              width: 'var(--n-height)',
              flex: `0 0 var(--n-height)`
            }"
          />
        </div>
      </div>
    </div>
    <div class="g-color-mapping-content">
      <n-collapse-transition :show="showPanel" class="g-color-mapping-main">
        <div class="--setting">
          <div class="--setting-name">映射类型</div>
          <div class="--setting-content">
            <n-radio-group
              :value="data.scale.type"
              :size="size"
              @update:value="onUpdateScaleType"
            >
              <n-radio-button value="ordinal" label="名词分类" />
              <n-radio-button value="linear" label="数值连续" />
              <n-radio-button value="threshold" label="数值分区" />
            </n-radio-group>
          </div>
        </div>
        <div class="--setting">
          <div class="--setting-name">颜色模板</div>
          <div class="--setting-content">
            <SchemeSelectPopover
              :value="data.scale.scheme"
              :colors="presetColor"
              :preset-colors="presetColors"
              @update:value="selectPresetColor"
            />
          </div>
        </div>
        <div class="--mapping-box">
          <div :class="`--mapping-area --${data.scale.type} ${data.scale.custom ? '--custom' : ''}`">
            <div class="--min">
              {{ (data.scale.type !== 'ordinal' && !data.scale.custom) ? 'min' : '' }}
            </div>
            <div :class="`--mapping-main ${data.scale.custom ? '--custom' : ''}`">
              <div class="--color-area">
                <template v-for="(pc, idx) in presetDomain" :key="idx">
                  <ColorEditor
                    v-if="!(data.scale.type === 'threshold' && data.scale.custom && idx === presetDomain.length - 1)"
                    :color="pc.color"
                    :value="pc.colorVal"
                    :pin="pc.pin"
                    :show-delete="data.scale.custom"
                    show-pin
                    :hide-color-block="data.scale.type === 'linear' && idx === presetDomain.length - 1"
                    @update-data="onUpdateColor(idx, $event)"
                  />
                </template>
                <ColorEditor
                  v-if="showExceptedEditor"
                  :color="data.scale.excepted"
                  :value="data.scale.excepted"
                  @update-data="onUpdateColor('excepted', $event)"
                />
              </div>
              <div v-if="data.scale.custom" class="--value-area">
                <ValueEditor
                  v-for="(pc, idx) in presetDomain"
                  :key="idx"
                  :type="data.scale.type === 'ordinal' ? 'string' : 'number'"
                  :value="pc.domain"
                  :color="pc.color"
                  @update-data="onUpdateValue(idx, $event)"
                />
                <ValueEditor
                  v-if="showExceptedEditor"
                  type="string"
                  value="其他值"
                  :color="data.scale.excepted"
                  readonly
                  tooltip="未在映射列表中的值"
                />
              </div>
            </div>
            <div v-if="data.scale.type !== 'ordinal' && !data.scale.custom" class="--max">
              max
            </div>
            <div class="--excepted --custom">
              <div class="--color-area">
                <ColorEditor
                  :color="data.scale.abnormal"
                  :value="data.scale.abnormal"
                  @update-data="onUpdateColor('abnormal', $event)"
                />
              </div>
              <div class="--value-area">
                <ValueEditor
                  type="string"
                  value="异常值"
                  :color="data.scale.abnormal"
                  readonly
                  tooltip="undefined/null/NaN"
                />
              </div>
            </div>
          </div>
          <div class="--function-area">
            <div v-if="data.scale.custom" class="--step-setting">
              <div class="--setting-name">数量</div>
              <div class="--setting-content">
                <g-input-number
                  v-model="colorNum"
                  size="tiny"
                />
              </div>
            </div>
            <span v-else class="--btn" @click="addItem">
              <n-icon :component="IconPlus" /> 添加
            </span>
            <span class="--btn">
              <n-icon :component="IconSort" /> 反序
            </span>
            <div class="--custom-setting">
              <div class="--setting-name" title="自定义映射">自定义映射</div>
              <div class="--setting-content">
                <n-switch v-model:value="data.scale.custom" />
              </div>
            </div>
          </div>
        </div>
      </n-collapse-transition>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import tinygradient from 'tinygradient'
import tinycolor2 from 'tinycolor2'
import { cloneDeep } from 'lodash-es'
import {
  NIcon, NInput, NColorPicker, NRadioGroup, NRadioButton,
  NSwitch, NTooltip, NCollapseTransition,
} from 'naive-ui'
import { IconArrowRight, IconConnect, IconDisconnect, IconPlus, IconSort } from '@/icons'
import { presetCatColors, presetSeqColors, presetDivColors } from '@/data/colors'
import { isColor, colorToJson, jsonToColor } from '@/utils/color-util'
import GInputNumber from '@/components/ui/input-number'
import { getDefaultColor } from './utils'
import { ColorMappingConfig, ColorMappingScaleType } from './interface'
import SchemeSelectPopover from './scheme-select-popover.vue'
import ColorEditor from './color-editor.vue'
import ValueEditor from './value-editor.vue'

const props = defineProps({
  data: {
    type: Object as PropType<ColorMappingConfig>,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
  },
})

const showPanel = ref(false)
const colorNum = ref(2)
const fillDto = ref<ColorMappingConfig>({
  mapping: true,
  fixed: {
    type: 'flat',
    value: '#1c81ff',
  },
  scale: {
    type: 'ordinal',
    custom: false,
    scheme: 'cat-7',
    domain: [0, 0, 0, 0, 0, 0, 0],
    pin: [false, false, false, false, false, false, false],
    range: ['#32ffa1', '#50ba58', '#00ceff', '#e7e342', '#ff6a00', '#8c57e4', '#1c81ff'],
    abnormal: 'transparent',
    excepted: 'yellow',
  },
})

const viewColors = computed(() => {
  const { scale } = props.data
  let list = []
  if (scale.type === 'ordinal') {
    list = scale.range.map(c => jsonToColor(c))
  } else if (scale.type === 'linear') {
    list = [tinygradient(scale.range).css('linear', '90deg')]
  } else if (scale.type === 'threshold') {
    list = scale.range
  }
  return list
})

const presetDomain = computed(() => {
  const { scale } = props.data
  let list: {
    color: string
    colorVal: string
    domain: number | string
    pin: boolean
  }[] = []
  if (scale.type === 'ordinal') {
    const arr1 = scale.range.map(c => jsonToColor(c))
    const arr2 = scale.range.map(c => jsonToColor(c, false))
    list = scale.domain.map((m, idx) => ({
      color: arr1[idx],
      colorVal: arr2[idx],
      domain: m,
      pin: scale.pin[idx],
    }))
  } else if (scale.type === 'linear') {
    list = scale.domain.map((m, idx) => ({
      color: scale.range[idx],
      colorVal: scale.range[idx],
      domain: m,
      pin: scale.pin[idx],
    }))
  } else if (scale.type === 'threshold') {
    const num = scale.custom ? scale.domain.length : scale.range.length
    for (let i = 0; i < num; i++) {
      list.push({
        color: scale.range[i],
        colorVal: scale.range[i],
        domain: scale.domain[i],
        pin: scale.pin[i],
      })
    }
  }
  return list
})

const presetColors = computed(() => {
  const { scale } = props.data
  let list = []
  if (scale.type === 'ordinal') {
    list = Object.entries(presetCatColors)
      .map(m => ({
        scheme: m[0],
        colors: m[1].slice(0, 6),
      }))
  } else if (scale.type === 'linear') {
    const arr1 = Object.entries(presetSeqColors)
      .map(([scheme, arr]) => ({
        scheme,
        colors: [tinygradient(arr).css('linear', '90deg')],
      }))

    const arr2 = Object.entries(presetDivColors)
      .map(([scheme, arr]) => ({
        scheme,
        colors: [tinygradient([
          { color: arr[0], pos: 0 },
          { color: arr[1], pos: 0.33 },
          { color: arr[2], pos: 1 },
        ]).css('linear', '90deg')],
      }))
    list = [...arr1, ...arr2]
  } else if (scale.type === 'threshold') {
    const arr1 = Object.entries(presetSeqColors)
      .map(([scheme, arr]) => ({
        scheme,
        colors: tinygradient(arr).rgb(6).map(m => m.toHexString()),
      }))
    const arr2 = Object.entries(presetDivColors)
      .map(([scheme, arr]) => ({
        scheme,
        colors: getDivColors(arr, 11).map(m => m.toHexString()),
      }))
    list = [...arr1, ...arr2]
  }
  return list
})

const presetColor = computed(() => {
  const pc = presetColors.value.find(m => m.scheme === props.data.scale.scheme)
  return pc ? pc.colors : []
})

const showExceptedEditor = computed(() => {
  const { type, custom, domain } = props.data.scale
  return custom && type === 'ordinal' && !domain.some(m => !m)
})

const getDivColors = (divColors: string[], num: number) => {
  return tinygradient(divColors).rgb(num).reduce((prev, curr, idx) => {
    if (idx % 2 === 0) {
      prev.push(curr)
    }
    return prev
  }, [])
}

const onUpdateScaleType = (type: ColorMappingScaleType) => {
  const { scale } = props.data
  props.data[scale.type] = cloneDeep(scale)
  props.data.scale = {
    type,
    ...(props.data[type] || getDefaultColor(type)),
  }
  colorNum.value = props.data.scale.range.length
}

const getCurrentColorRange = () => {
  const { type, scheme } = props.data.scale
  let colorRange = []
  if (type === 'ordinal') {
    const arr = presetCatColors[scheme]
    const len = Math.ceil(colorNum.value / arr.length)
    const bigArr = []
    for (let i = 0; i < len; i++) {
      bigArr.push(...arr)
    }
    colorRange = bigArr.slice(0, colorNum.value)
  } else {
    if (scheme.startsWith('seq')) {
      colorRange = tinygradient(presetSeqColors[scheme]).rgb(colorNum.value)
    } else if (scheme.startsWith('div')) {
      const arr = presetDivColors[scheme]
      if (colorNum.value === 2) {
        colorRange = tinygradient([arr[0], arr[2]]).rgb(colorNum.value)
      } else if (colorNum.value & 1) {
        colorRange = tinygradient(arr).rgb(colorNum.value)
      } else {
        colorRange = getDivColors(arr, colorNum.value * 2 - 1)
      }
    }
    colorRange = colorRange.map(m => m.toHexString())
  }
  return colorRange
}

const selectPresetColor = (val: string) => {
  props.data.scale.scheme = val
  props.data.scale.range = getCurrentColorRange()
}

const onUpdateColor = (index: number | string, data: any) => {
  if (index === 'excepted') {
    props.data.scale.excepted = data.value
  } else if (index === 'abnormal') {
    props.data.scale.abnormal = data.value
  } else if (typeof index === 'number') {
    if (data.key === 'pin') {
      props.data.scale.pin[index] = data.pin
    } else {
      if (isColor(data.value)) {
        props.data.scale.range[index] = tinycolor2(data.value).toHexString()
      } else {
        const pcs = getCurrentColorRange()
        props.data.scale.range[index] = colorToJson(data.value, pcs[index])
      }
    }
  }
}

const onUpdateValue = (index: number, val: string | number) => {
  props.data.scale.domain[index] = val
}

const addItem = () => {
  colorNum.value += 1
  const { scale } = props.data
  if (scale.type === 'ordinal') {
    const pcs = getCurrentColorRange()
    scale.range.push(pcs[colorNum.value - 1])
    scale.domain.push('')
  } else {
    scale.range.push('#969696')
    const ev = scale.domain[scale.domain.length - 1] as number
    scale.domain.push(ev >= 0 ? ev + 1 : 0)
  }
  scale.pin.push(false)
}

const toggleShowPanel = () => {
  showPanel.value = !showPanel.value
}

onMounted(() => {
  colorNum.value = props.data.scale.range.length
})
</script>
