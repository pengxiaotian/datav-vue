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
            :class="{ '--disabled': !hasData }"
            @click.stop="copyData"
          ></i>
          <i
            v-if="showToolboxAdd"
            class="v-icon-plus toolbox-icon"
            @click.stop="addData"
          ></i>
          <i
            v-if="showToolboxDel"
            class="v-icon-delete toolbox-icon"
            :class="{ '--disabled': !hasData }"
            @click.stop="deleteData"
          ></i>
        </div>
      </template>

      <template v-if="mode === 'layout'">
        <template v-if="hasData">
          <el-tabs
            v-if="isLayoutRow"
            v-model="activeTab"
            type="border-card"
            class="g-field-tabs"
          >
            <el-tab-pane
              v-for="(item, idx) in list"
              :key="idx"
              :label="label + idx"
            >
              <slot :item="item"></slot>
            </el-tab-pane>
          </el-tabs>
          <div v-else class="g-field-tabs --column">
            <div
              v-for="(item, idx) in list"
              :key="idx"
              class="g-field-tabs-column-item"
            >
              <slot :item="item"></slot>
            </div>
          </div>
        </template>
        <span v-else class="g-field-collapse-panel-empty">
          列表为空
        </span>
      </template>
      <slot v-else></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, PropType, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import { ToolboxType } from '@/utils/enums'

export default defineComponent({
  name: 'GFieldCollapse',
  props: {
    mode: {
      type: String as PropType<'' | 'layout'>,
      default: '',
    },
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
    defaultLayout: {
      type: String as PropType<ToolboxType.horizontal | ToolboxType.vertical>,
      default: ToolboxType.horizontal,
    },
    features: {
      type: Array as PropType<ToolboxType[]>,
      default: () => [],
    },
    list: Array,
    defaultNewValue: String,
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const activeNames = ref([])
    const activeTab = ref('0')
    const isLayoutRow = ref(props.defaultLayout === ToolboxType.horizontal)

    const hasData = computed(() => {
      return props.list && props.list.length > 0
    })

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

    const copyData = () => {
      if (hasData.value) {
        const idx = Math.min(+activeTab.value, props.list.length - 1)
        props.list.push(cloneDeep(props.list[idx]))
      }
    }

    const deleteData = () => {
      if (hasData.value) {
        const idx = Math.min(+activeTab.value, props.list.length - 1)
        props.list.splice(idx, 1)
        activeTab.value = '0'
      }
    }

    const addData = () => {
      if (props.defaultNewValue) {
        props.list.push(JSON.parse(props.defaultNewValue))
      }
    }

    watch(() => props.modelValue, (nv: boolean) => {
      if (!nv) {
        activeNames.value = []
      }
    })

    return {
      activeNames,
      activeTab,
      isLayoutRow,
      hasData,
      visibleToolbox,
      showToolboxRow,
      showToolboxCol,
      showToolboxCopy,
      showToolboxAdd,
      showToolboxDel,
      showToolboxSplit,
      toggleVisible,
      copyData,
      addData,
      deleteData,
    }
  },
})
</script>
