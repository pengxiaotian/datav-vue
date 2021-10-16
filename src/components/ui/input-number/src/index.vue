<template>
  <div
    class="datav-gui g-input-number"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <n-config-provider :theme-overrides="themeOverrides" abstract>
      <n-input-number
        :value="modelValue"
        :size="size"
        :min="min"
        :max="max"
        :step="step"
        @update:value="handleInput"
      >
        <template v-if="suffix" #suffix>
          {{ suffix }}
        </template>
      </n-input-number>
    </n-config-provider>
    <span v-if="label" class="g-input__caption">
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
      default: 'small',
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
    suffix: String,
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const handleInput = (value: number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const themeOverrides = {
      Button: {
        textColorText: 'var(--datav-font-color)',
        fontSizeMedium: '12px',
        iconSizeMedium: '12px',
      },
    }

    if (props.size === 'medium') {
      themeOverrides.Button.fontSizeMedium = '14px'
      themeOverrides.Button.iconSizeMedium = '14px'
    }

    return {
      themeOverrides,
      handleInput,
    }
  },
})
</script>
