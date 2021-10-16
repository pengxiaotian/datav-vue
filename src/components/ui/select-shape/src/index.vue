<template>
  <div
    class="datav-gui g-select-shape"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <n-select
      :value="modelValue"
      :options="opts"
      :size="size"
      :disabled="disabled"
      @update:value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, h } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import OptionLabel from './option-label.vue'

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
      default: 'small',
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

    const opts = props.shapes.map(m => ({
      value: m.id,
      label() {
        return h(OptionLabel, {
          label: m.value,
          icon: m.icon,
        })
      },
    }))

    return {
      opts,
      handleInput,
    }
  },
})
</script>
