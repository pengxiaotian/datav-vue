<template>
  <div
    class="datav-gui g-select-shape"
    :class="[
      `--${size}`,
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <el-select
      :model-value="modelValue"
      :size="size"
      :disabled="disabled"
      @update:model-value="handleInput"
    >
      <el-option
        v-for="item in shapes"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      >
        <span class="g-select-shape-item">
          <span>{{ item.value }}</span>
          <i :class="`v-icon-legend-${item.icon}`"></i>
        </span>
      </el-option>
    </el-select>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

interface ShapeType {
  id: string
  value: string
  icon: string
}

export default defineComponent({
  name: 'GSelectShape',
  props: {
    modelValue: {
      type: [String, Number],
      default: 0,
    },
    shapes: {
      type: Array as PropType<ShapeType[]>,
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
    inline: {
      type: [Boolean, String],
      default: false,
    },
    disabled: Boolean,
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const handleInput = (value: string | number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    return {
      handleInput,
    }
  },
})
</script>
