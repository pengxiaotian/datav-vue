<template>
  <div
    class="datav-gui g-input"
    :class="[
      `--${size}`,
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <el-input
      :model-value="modelValue"
      :size="size"
      @update:model-value="handleInput"
      @change="handleChange"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GInput',
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
    inline: {
      type: [Boolean, String],
      default: false,
    },
    disabled: Boolean,
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup(props, ctx) {
    const handleInput = (value: string | number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const handleChange = (currentValue: string | number) => {
      ctx.emit('change', currentValue)
    }

    return {
      handleInput,
      handleChange,
    }
  },
})
</script>
