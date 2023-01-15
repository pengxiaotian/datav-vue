<template>
  <div
    class="datav-gui g-radio-group"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <div class="g-radio-group-inner">
      <n-radio-group
        :value="modelValue"
        :size="size"
        :disabled="disabled"
        @update:value="handleInput"
      >
        <template v-if="isButton">
          <n-radio-button v-for="pair in opts" :key="pair.value" :value="pair.value">
            {{ pair.label }}
          </n-radio-button>
        </template>
        <template v-else>
          <n-radio v-for="pair in opts" :key="pair.value" :value="pair.value">
            {{ pair.label }}
          </n-radio>
        </template>
      </n-radio-group>
    </div>
    <template v-if="tooltip && label">
      <n-tooltip placement="top">
        <template #trigger>
          <span class="g-input__caption-with-description">
            {{ label }}
          </span>
        </template>
        {{ tooltip }}
      </n-tooltip>
    </template>
    <span v-else-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { computed, PropType } from 'vue'
import { NRadioGroup, NRadioButton, NRadio, NTooltip } from 'naive-ui'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

const props =  defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<'medium' | 'small' | 'large'>,
    default: 'small',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
  data: {
    type: Array as PropType<{
      id?: string
      key?: string
      value: string
    }[]>,
    default: () => [],
  },
  disabled: Boolean,
  isButton: Boolean,
  tooltip: String,
})

const emits = defineEmits([UPDATE_MODEL_EVENT])

const opts = computed(() => {
  return props.data.map(m => ({
    label: m.value,
    value: m.id || m.key,
  }))
})

const handleInput = (value: boolean) => {
  emits(UPDATE_MODEL_EVENT, value)
}
</script>
