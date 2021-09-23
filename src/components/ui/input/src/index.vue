<template>
  <div
    class="datav-gui g-input"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <n-input
      :value="modelValue"
      :size="size"
      @update:value="handleInput"
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
      default: 'small',
    },
    inline: {
      type: [Boolean, String],
      default: false,
    },
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
