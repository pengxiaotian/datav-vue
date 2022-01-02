<template>
  <div
    class="datav-gui g-color-picker"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <div class="g-color-picker__inner">
      <n-input
        :value="modelValue"
        :size="size"
        @update:value="handleInput"
      />
      <n-color-picker
        :value="modelValue"
        :size="size"
        show-alpha
        :style="{
          width: 'var(--n-height)',
          flex: `0 0 var(--n-height)`
        }"
        @update:value="handleInput"
      />
    </div>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
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
      default: 'small',
    },
    label: {
      type: String,
      default: '',
    },
    inline: {
      type: [Boolean, String],
      default: false,
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
