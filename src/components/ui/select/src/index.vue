<template>
  <div
    class="datav-gui g-select"
    :class="[
      `--${size}`,
      {
        '--inline': isInline,
        '--disabled': disabled,
      }
    ]"
  >
    <el-select
      :model-value="modelValue"
      :size="size"
      :disabled="disabled"
      @update:model-value="handleInput"
      @change="handleChange"
    >
      <el-option
        v-for="item in data"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      />
    </el-select>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: 0,
    },
    data: {
      type: Array as PropType<{ id: string | number; value: string | number; }[]>,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'mini',
    },
    isInline: Boolean,
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
