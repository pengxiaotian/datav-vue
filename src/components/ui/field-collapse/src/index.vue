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
        <div v-if="visibleToolbox" class="g-field-collapse-panel-toolbox">
          <n-icon
            v-if="showToolboxRow"
            class="toolbox-icon"
            :class="{ '--selected': isLayoutRow }"
            @click.stop="isLayoutRow = true"
          >
            <IconLayoutRow />
          </n-icon>
          <n-icon
            v-if="showToolboxCol"
            class="toolbox-icon"
            :class="{ '--selected': !isLayoutRow }"
            @click.stop="isLayoutRow = false"
          >
            <IconLayoutColumn />
          </n-icon>

          <span
            v-if="showToolboxSplit"
            class="g-field-collapse-panel-toolbox-split"
          ></span>

          <template v-if="showToolboxCopy">
            <n-tooltip placement="top" :disabled="!copyState.disabled">
              <template #trigger>
                <n-icon
                  class="toolbox-icon"
                  :class="{ '--disabled': copyState.disabled }"
                  @click.stop="copyData"
                >
                  <IconCopy />
                </n-icon>
              </template>
              {{ copyState.msg }}
            </n-tooltip>
          </template>
          <template v-if="showToolboxAdd">
            <n-tooltip placement="top" :disabled="!addState.disabled">
              <template #trigger>
                <n-icon
                  class="toolbox-icon"
                  :class="{ '--disabled': addState.disabled }"
                  @click.stop="addData"
                >
                  <IconPlus />
                </n-icon>
              </template>
              {{ addState.msg }}
            </n-tooltip>
          </template>
          <template v-if="showToolboxDel">
            <n-tooltip placement="top" :disabled="!deleteState.disabled">
              <template #trigger>
                <n-icon
                  class="toolbox-icon"
                  :class="{ '--disabled': deleteState.disabled }"
                  @click.stop="deleteData"
                >
                  <IconDelete />
                </n-icon>
              </template>
              {{ deleteState.msg }}
            </n-tooltip>
          </template>
        </div>
      </template>

      <template v-if="mode === 'layout'">
        <template v-if="list && list.length > 0">
          <el-tabs
            v-if="isLayoutRow"
            v-model="activeTab"
            type="border-card"
            class="g-field-tabs"
          >
            <el-tab-pane
              v-for="(item, idx) in list"
              :key="idx"
              :label="getTabLabel(idx)"
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
              <span
                class="g-field-tabs-column-item-head"
                :class="{ '--selected': idx === +activeTab }"
                @click="changeTab(idx)"
              >
                {{ getTabLabel(idx) }}
              </span>
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
import { IconPlus, IconDelete, IconCopy, IconLayoutRow, IconLayoutColumn } from '@/icons'

export default defineComponent({
  name: 'GFieldCollapse',
  components: {
    IconPlus,
    IconDelete,
    IconCopy,
    IconLayoutRow,
    IconLayoutColumn,
  },
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
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1000,
    },
    tab: String,
    addItem: {
      type: Function,
      default: () => {},
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const activeNames = ref([])
    const activeTab = ref('0')
    const isLayoutRow = ref(props.defaultLayout === ToolboxType.horizontal)

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

    const copyState = computed(() => {
      const disabled = !props.list || props.list.length < props.min || props.list.length >= props.max
      const msg = disabled ? '不可复制' : ''
      return {
        disabled,
        msg,
      }
    })

    const addState = computed(() => {
      const disabled = !props.list || props.list.length >= props.max
      const msg = disabled ? '已至最大项数' : ''
      return {
        disabled,
        msg,
      }
    })

    const deleteState = computed(() => {
      const disabled = !props.list || props.list.length <= props.min
      const msg = disabled ? '已至最小项数' : ''
      return {
        disabled,
        msg,
      }
    })

    const toggleVisible = (nv: boolean) => {
      ctx.emit(UPDATE_MODEL_EVENT, nv)
    }

    const copyData = () => {
      if (!copyState.value.disabled) {
        const idx = Math.min(+activeTab.value, props.list.length - 1)
        props.list.push(cloneDeep(props.list[idx]))
      }
    }

    const deleteData = () => {
      if (!deleteState.value.disabled) {
        const idx = Math.min(+activeTab.value, props.list.length - 1)
        props.list.splice(idx, 1)
        activeTab.value = '0'
      }
    }

    const addData = () => {
      if (!addState.value.disabled && typeof props.addItem === 'function') {
        const item = props.addItem() || {}
        props.list.push(item)
      }
    }

    const getTabLabel = (idx: number) => {
      return (props.tab || props.label) + (idx + 1)
    }

    const changeTab = (idx: number) => {
      activeTab.value = `${idx}`
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
      visibleToolbox,
      showToolboxRow,
      showToolboxCol,
      showToolboxCopy,
      showToolboxAdd,
      showToolboxDel,
      showToolboxSplit,
      copyState,
      addState,
      deleteState,
      toggleVisible,
      copyData,
      addData,
      deleteData,
      getTabLabel,
      changeTab,
    }
  },
})
</script>
