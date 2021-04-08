<template>
  <div class="g-color-picker">
    <el-input
      :model-value="modelValue"
      :size="size"
      @update:model-value="handleInput"
    />
    <el-color-picker
      :model-value="modelValue"
      :size="size"
      show-alpha
      :predefine="predefine"
      popper-class="is-dark"
      @update:model-value="handleInput"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GColorPicker',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'mini',
    },
    predefine: Array,
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
