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
      <n-collapse-transition :show="showPanel">
        <div class="g-color-mapping-main">
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
            <div class="--mapping-area --ordinal">
              <div class="--min"></div>
              <div class="--mapping-main">
                <div class="--color-area">
                  <div
                    v-for="(pc, idx) in presetColor"
                    :key="idx"
                    class="--color-editor"
                  >
                    <n-icon :component="IconDelete" class="--delete" />
                    <div class="--color-block color-block">
                      <span class="--block" :style="`background: ${pc};`"></span>
                    </div>
                    <div class="--color-changer --with-pin">
                      <div class="datav-gui-fill datav-gui-component --normal">
                        <span class="datav-gui-fill-default">
                          <span class="--block" :style="`background: ${pc};`"></span>
                        </span>
                        <input class="datav-gui-fill-input" style="display: block;">
                      </div>
                      <n-tooltip placement="top">
                        <template #trigger>
                          <n-icon
                            :component="IconPinFill"
                            class="--color-pin"
                          />
                        </template>
                        已「钉住」，颜色不会随切换模板而更改
                      </n-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div class="--excepted --custom">
                <div class="--color-area">
                  <div class="--color-editor">
                    <n-icon :component="IconDelete" class="--delete" />
                    <div class="--color-block color-block">
                      <span class="--block" :style="`background: ${data.scale.abnormal};`"></span>
                    </div>
                    <div class="--color-changer --with-pin">
                      <div class="datav-gui-fill datav-gui-component --normal">
                        <span class="datav-gui-fill-default">
                          <span class="--block" :style="`background: ${data.scale.abnormal};`"></span>
                        </span>
                        <input class="datav-gui-fill-input" style="display: block;">
                      </div>
                      <n-icon
                        :component="IconPin"
                        class="--color-pin"
                      />
                    </div>
                  </div>
                </div>
                <div class="--value-area">
                  <div class="--value-editor">
                    <div class="--color-dot color-block">
                      <span style="background: rgb(128 128 128);"></span>
                    </div>
                    <input
                      class="datav-input datav-input--disabled"
                      placeholder="输入字段值"
                      spellcheck="false"
                      value="异常值"
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="--function-area">
              <div class="--step-setting">
                <div class="--setting-name">数量</div>
                <div class="--setting-content">
                  <g-input-number
                    v-model="colorNum"
                    size="small"
                  />
                </div>
              </div>
              <span class="--btn">
                <n-icon :component="IconSort" /> 反序
              </span>
              <div class="--custom-setting">
                <div class="--setting-name" title="自定义映射">自定义映射</div>
                <div class="--setting-content">
                  <n-switch
                    v-model:value="data.scale.custom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-collapse-transition>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import {
  NIcon, NInput, NColorPicker, NRadioGroup, NRadioButton,
  NSwitch, NTooltip, NCollapseTransition,
} from 'naive-ui'
import tinygradient from 'tinygradient'
import { cloneDeep } from 'lodash-es'
import {
  IconArrowRight, IconConnect, IconDelete, IconDisconnect,
  IconSort, IconPin, IconPinFill,
} from '@/icons'
import { presetCatColors, presetSeqColors, presetDivColors } from '@/data/colors'
import { jsonToColor } from '@/utils/color-util'
import GInputNumber from '@/components/ui/input-number'
import { getDefaultColor } from './utils'
import { ColorMappingConfig, ColorMappingScaleType } from './interface'
import SchemeSelectPopover from './scheme-select-popover.vue'

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
        colors: tinygradient(arr).rgb(6),
      }))
    const arr2 = Object.entries(presetDivColors)
      .map(([scheme, arr]) => ({
        scheme,
        colors: getDivColors(arr, 11),
      }))
    list = [...arr1, ...arr2]
  }
  return list
})

const presetColor = computed(() => {
  const pc = presetColors.value.find(m => m.scheme === props.data.scale.scheme)
  return pc ? pc.colors : []
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

const selectPresetColor = (val: string) => {
  props.data.scale.scheme = val
  const { type } = props.data.scale
  let colorRange = []
  if (type === 'ordinal') {
    colorRange = presetCatColors[val].slice(0, colorNum.value)
  } else if (type === 'linear') {
    if (val.startsWith('seq')) {
      colorRange = tinygradient(presetSeqColors[val]).rgb(colorNum.value)
    } else if (val.startsWith('div')) {
      const arr = presetDivColors[val]
      if (colorNum.value === 2) {
        colorRange = tinygradient([arr[0], arr[2]]).rgb(colorNum.value)
      } else if (colorNum.value & 1) {
        colorRange = tinygradient(arr).rgb(colorNum.value)
      } else {
        colorRange = getDivColors(arr, colorNum.value * 2 - 1)
      }
    }
  } else if (type === 'threshold') {
    if (val.startsWith('seq')) {
      colorRange = tinygradient(presetSeqColors[val]).rgb(colorNum.value)
    } else if (val.startsWith('div')) {
      const arr = presetDivColors[val]
      if (colorNum.value === 2) {
        colorRange = tinygradient([arr[0], arr[2]]).rgb(colorNum.value)
      } else if (colorNum.value & 1) {
        colorRange = tinygradient(arr).rgb(colorNum.value)
      } else {
        colorRange = getDivColors(arr, colorNum.value * 2 - 1)
      }
    }
  }
  props.data.scale.range = colorRange
}

const toggleShowPanel = () => {
  showPanel.value = !showPanel.value
}
</script>
