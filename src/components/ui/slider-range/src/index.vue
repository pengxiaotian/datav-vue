<template>
  <div
    class="datav-gui g-slider-range"
    :class="[
      {
        '--inline --single': !!inline,
      }
    ]"
  >
    <n-config-provider :theme-overrides="themeOverrides" abstract>
      <div class="g-slider-main">
        <div class="g-slider-range-wrap">
          <span class="g-slider-range-current">
            {{ `${modelValue[0]} - ${modelValue[1]}` }}
          </span>
        </div>
        <n-slider
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :tooltip="false"
          range
          @update:value="handleInput"
        />
      </div>
    </n-config-provider>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { PropType } from 'vue'
import { NConfigProvider, NSlider } from 'naive-ui'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

const props = defineProps({
  modelValue: {
    type: Array as PropType<number[]>,
    default: () => [0, 1],
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
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
