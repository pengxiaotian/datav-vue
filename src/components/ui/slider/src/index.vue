<template>
  <div
    class="datav-gui g-slider"
    :class="[
      `--${size}`,
      {
        '--inline --single': !!inline,
        'has-suffix': !!suffix,
      }
    ]"
  >
    <el-slider
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :show-input="showInput"
      :input-size="inputSize"
      :show-tooltip="false"
      :class="{ 'is-controls-right': controlsPosition === 'right' }"
      @update:model-value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
    <span v-if="suffix" class="g-input-number__suffix">
      {{ suffix }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GSlider',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'mini',
    },
    showInput: {
      type: Boolean,
      default: true,
    },
    inputSize: {
      type: String,
      default: 'mini',
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
    controlsPosition: {
      type: String,
      default: 'right',
    },
    suffix: String,
    disabled: Boolean,
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const handleInput = (value: number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    return {
      handleInput,
    }
  },
})
</script>
