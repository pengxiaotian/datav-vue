<template>
  <el-row
    :class="[
      'g-field-wp',
      `--lv${level}`,
      {
        '--disable': disabled || (toggle && !modelValue)
      }
    ]"
  >
    <el-col class="g-field" v-bind="labelStyle">
      <i class="g-field-show-placeholder">
        <i
          v-if="toggle"
          :class="['g-field-show', modelValue ? 'v-icon-show' : 'v-icon-hide']"
          @click="toggleVisible"
        ></i>
      </i>
      <template v-if="tooltip">
        <el-tooltip effect="blue" placement="top" :offset="2">
          <template #content>
            <span v-html="tooltip"></span>
          </template>
          <label class="g-field-title-with-description" :title="label">
            {{ label }}
          </label>
        </el-tooltip>
      </template>
      <label v-else class="g-field-title" :title="label">
        {{ label }}
      </label>
    </el-col>
    <el-col class="g-field-container" v-bind="contentStyle">
      <slot></slot>
      <span v-if="caption" class="g-field-caption" :title="caption">
        {{ caption }}
      </span>
    </el-col>
  </el-row>
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
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const toggleVisible = () => {
      ctx.emit(UPDATE_MODEL_EVENT, !props.modelValue)
    }

    const labelStyle = computed(() => {
      return {
        span: props.nest ? 24 : 0,
      }
    })

    const contentStyle = computed(() => {
      return {
        span: props.nest ? 24 : 0,
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
