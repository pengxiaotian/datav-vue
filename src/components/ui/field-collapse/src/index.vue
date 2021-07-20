<template>
  <el-collapse
    v-model="activeNames"
    class="g-field-collapse"
    :class="{ '--disable': toggle && !modelValue }"
  >
    <el-collapse-item
      :disabled="!modelValue"
      class="g-field-collapse-panel"
      :class="{
        '--has-toolbox': visibleToolbox
      }"
    >
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
        <div v-if="visibleToolbox" class="g-field-collapse-panel-toolbox">
          <i
            v-if="showToolboxRow"
            class="v-icon-layout-row toolbox-icon"
            :class="{ '--selected': isLayoutRow }"
            @click.stop="isLayoutRow = true"
          ></i>
          <i
            v-if="showToolboxCol"
            class="v-icon-layout-column toolbox-icon"
            :class="{ '--selected': !isLayoutRow }"
            @click.stop="isLayoutRow = false"
          ></i>
          <span
            v-if="showToolboxSplit"
            class="g-field-collapse-panel-toolbox-split"
          ></span>
          <i
            v-if="showToolboxCopy"
            class="v-icon-copy toolbox-icon"
          ></i>
          <i
            v-if="showToolboxAdd"
            class="v-icon-plus toolbox-icon"
          ></i>
          <i
            v-if="showToolboxDel"
            class="v-icon-delete toolbox-icon"
          ></i>
        </div>
      </template>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, PropType, computed } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import { ToolboxType } from '@/utils/enums'

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
    features: {
      type: Array as PropType<ToolboxType[]>,
      default: () => [],
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const activeNames = ref([])
    const isLayoutRow = ref(false)

    const visibleToolbox = computed(() => {
      return activeNames.value.length > 0 && props.features.length > 0
    })

    const showToolboxRow = computed(() => {
      return props.features.includes(ToolboxType.horizontal)
    })

    const showToolboxCol = computed(() => {
      return props.features.includes(ToolboxType.vertical)
    })

    const showToolboxCopy = computed(() => {
      return props.features.includes(ToolboxType.copy)
    })

    const showToolboxAdd = computed(() => {
      return props.features.includes(ToolboxType.add)
    })

    const showToolboxDel = computed(() => {
      return props.features.includes(ToolboxType.remove)
    })

    const showToolboxSplit = computed(() => {
      return (showToolboxRow.value || showToolboxCol.value)
        && (showToolboxCopy.value || showToolboxAdd.value || showToolboxDel.value)
    })

    const toggleVisible = (nv: boolean) => {
      ctx.emit(UPDATE_MODEL_EVENT, nv)
    }

    watch(() => props.modelValue, (nv: boolean) => {
      if (!nv) {
        activeNames.value = []
      }
    })

    watch(isLayoutRow, (nv: boolean) => {
      console.log(nv)
    })

    return {
      activeNames,
      isLayoutRow,
      visibleToolbox,
      showToolboxRow,
      showToolboxCol,
      showToolboxCopy,
      showToolboxAdd,
      showToolboxDel,
      showToolboxSplit,
      toggleVisible,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';
</style>
