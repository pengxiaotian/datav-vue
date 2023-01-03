<template>
  <div
    class="datav-gui g-slider"
    :class="[
      {
        '--inline --single': !!inline,
      }
    ]"
  >
    <n-config-provider :theme-overrides="themeOverrides" abstract>
      <div class="g-slider-main">
        <n-slider
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :tooltip="false"
          @update:value="handleInput"
        />
        <n-input-number
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :size="size"
          @update:value="handleInput"
        >
          <template v-if="suffix" #suffix>
            {{ suffix }}
          </template>
        </n-input-number>
      </div>
    </n-config-provider>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { PropType } from 'vue'
import { NConfigProvider, NSlider, NInputNumber } from 'naive-ui'
import type { Size } from 'naive-ui/es/input-number/src/interface'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<Size>,
    default: 'small',
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  step: {
    type: Number,
    default: 1,
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
  suffix: String,
  disabled: Boolean,
})
const emits = defineEmits([UPDATE_MODEL_EVENT])

const handleInput = (value: number) => {
  emits(UPDATE_MODEL_EVENT, value)
}

const themeOverrides = {
  Button: {
    textColorText: 'var(--datav-font-color)',
    fontSizeMedium: '12px',
    iconSizeMedium: '12px',
  },
}

if (props.size === 'medium') {
  themeOverrides.Button.fontSizeMedium = '14px'
  themeOverrides.Button.iconSizeMedium = '14px'
}
</script>
