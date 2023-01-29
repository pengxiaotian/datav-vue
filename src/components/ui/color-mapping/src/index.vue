<template>
  <div
    class="datav-gui g-color-mapping"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <div class="g-color-mapping-fixed">
      <n-input
        :value="fillDto.fixed.value"
        :size="size"
        @update:value="handleFixedColor"
      />
      <n-color-picker
        :value="fillDto.fixed.value"
        :size="size"
        show-alpha
        :style="{
          width: 'var(--n-height)',
          flex: `0 0 var(--n-height)`
        }"
        @update:value="handleFixedColor"
      />
    </div>
    <div class="g-color-mapping-scale">
      <div class="g-color-mapping-scale-selection">
        <div>{{ fillDto.scale.scheme }}</div>
        <n-button text size="small">
          <n-icon :component="IconArrowRight" />
        </n-button>
      </div>
      <div class="g-color-mapping-scale-config">
        <n-collapse-transition :show="showPanel">
          感知度，方法论，组合拳，引爆点，点线面，精细化，差异化，平台化，结构化，影响力，耦合性，便捷性，一致性，端到端，短平快，护城河，体验感，颗粒度
        </n-collapse-transition>
      </div>
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
import { ref } from 'vue'
import type { PropType } from 'vue'
import { NInput, NColorPicker, NTooltip, NButton, NIcon, NCollapseTransition } from 'naive-ui'
import { IconArrowRight } from '@/icons'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

defineProps({
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
  tooltip: String,
})
const emits = defineEmits([UPDATE_MODEL_EVENT])

const showPanel = ref(false)
const fillDto = ref({
  mapping: true,
  fixed: {
    type: 'flat',
    value: '#1c81ff',
  },
  scale: {
    type: 'ordinal',
    custom: false,
    scheme: 'cat-7',
    abnormal: 'transparent',
    excepted: 'yellow',
    pin: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    range: [
      '#32FFA1',
      '#50BA58',
      '#00CEFF',
      '#E7E342',
      '#FF6A00',
      '#8C57E4',
      '#1C81FF',
    ],
    domain: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
})

const handleFixedColor = (value: string | number) => {
  emits(UPDATE_MODEL_EVENT, value)
}
</script>
