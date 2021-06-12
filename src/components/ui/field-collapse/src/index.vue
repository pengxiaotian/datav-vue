<template>
  <el-collapse
    v-model="activeNames"
    class="g-field-collapse"
    :class="[{ '--disable': toggle && !modelValue }]"
  >
    <el-collapse-item :disabled="!modelValue">
      <template #title>
        <i class="g-field-show-placeholder">
          <el-switch
            v-if="toggle"
            :model-value="modelValue"
            class="--mini"
            @click.stop
            @change="toggleVisible"
          />
        </i>
        <template v-if="tooltip">
          <el-tooltip effect="blue" placement="top" :offset="2">
            <template #content>
              <slot name="tooltip">{{ tooltip }}</slot>
            </template>
            <label class="g-field-title-with-description" :title="label">
              {{ label }}
            </label>
          </el-tooltip>
        </template>
        <label v-else class="g-field-title" :title="label">
          {{ label }}
        </label>
      </template>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GFieldCollapse',
  props: {
    label: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
    },
    toggle: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const activeNames = ref([])

    const toggleVisible = (nv: boolean) => {
      ctx.emit(UPDATE_MODEL_EVENT, nv)
    }

    watch(() => props.modelValue, (nv: boolean) => {
      if (!nv) {
        activeNames.value = []
      }
    })

    return {
      activeNames,
      toggleVisible,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';
</style>
