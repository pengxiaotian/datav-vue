<template>
  <div
    class="datav-gui g-switch"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <n-switch
      :value="modelValue"
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
import { defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'medium',
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
