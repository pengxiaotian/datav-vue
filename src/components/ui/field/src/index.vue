<template>
  <n-grid
    :class="[
      `g-field-wp --lv${level}`,
      {
        '--field-disabled': disabled || (toggle && !modelValue)
      }
    ]"
  >
    <n-gi class="g-field" v-bind="labelStyle">
      <i class="g-field-show-placeholder">
        <n-switch
          v-if="toggle"
          :value="modelValue"
          size="small"
          @click.stop
          @update:value="toggleVisible"
        />
      </i>
      <template v-if="tooltip">
        <n-tooltip placement="top">
          <template #trigger>
            <label class="g-field-title-with-description" :title="label">
              {{ label }}
            </label>
          </template>
          <span v-html="tooltip"></span>
        </n-tooltip>
      </template>
      <label v-else class="g-field-title" :title="label">
        {{ label }}
      </label>
    </n-gi>
    <n-gi
      class="g-field-container"
      :class="{ '--flat': isFlat }"
      v-bind="contentStyle"
    >
      <slot></slot>
      <span v-if="caption" class="g-field-caption" :title="caption">
        {{ caption }}
      </span>
    </n-gi>
  </n-grid>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GField',
  props: {
    label: {
      type: String,
      required: true,
    },
    tooltip: String,
    toggle: Boolean,
    modelValue: {
      type: Boolean,
      default: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    nest: Boolean,
    caption: String,
    disabled: Boolean,
    isFlat: Boolean,
    labelSpan: {
      type: Number,
      default: 9,
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const toggleVisible = () => {
      ctx.emit(UPDATE_MODEL_EVENT, !props.modelValue)
    }

    const labelStyle = computed(() => {
      return {
        span: props.nest ? 24 : props.labelSpan,
      }
    })

    const contentStyle = computed(() => {
      return {
        span: props.nest ? 24 : 15,
      }
    })

    return {
      toggleVisible,
      labelStyle,
      contentStyle,
    }
  },
})
</script>
