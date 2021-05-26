<template>
  <div
    class="g-input-number"
    :class="[`--${size}`, { '--inline': isInline }]"
  >
    <el-input-number
      :model-value="modelValue"
      :size="size"
      :min="min"
      :max="max"
      :step="step"
      class="is-controls-right"
      @update:model-value="handleInput"
    />
    <span v-if="label" class="g-input-number-caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GInputNumber',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    size: {
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
    isInline: {
      type: Boolean,
      default: true,
    },
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
