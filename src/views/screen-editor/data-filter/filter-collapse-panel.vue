<template>
  <div
    ref="panelRef"
    class="collapse-panel-wp filter-item ds-panel-filter"
    :class="{
      '--create': isNew,
      '--spread': collapse || isNew,
      '--draggable': draggable,
      '--unused': hasFeedback && !isEnabled,
      '--error': !!errMsg,
    }"
    @dragenter="dragEnter"
  >
    <div class="panel-header">
      <div class="panel-title">
        <div class="filter-title">
          <template v-if="draggable">
            <n-icon
              draggable="true"
              class="drag-btn"
              @dragstart="dragStart"
              @dragend="dragEnd"
            >
              <IconDrag />
            </n-icon>
            <n-checkbox
              :checked="isEnabled"
              class="enable-checkbox"
              @update:checked="switchEnabled"
            />
          </template>
          <div class="filter-name">
            <new-input
              v-if="editing"
              :model-value="dataFilter.name"
              :autofocus="true"
              class="filter-name-input"
              @change="editName"
            />
            <div v-else class="filter-name-text" :title="dataFilter.name">
              {{ dataFilter.name }}
            </div>
          </div>
          <div class="action-wp --edit">
            <g-tooltip-popover content="重命名">
              <n-icon class="edit-btn" @click="editing = true">
                <IconEdit />
              </n-icon>
            </g-tooltip-popover>
          </div>
          <div class="filter-count">
            <template v-if="!isNew && usedFilters[dataFilter.id]">
              <n-tooltip
                placement="top"
                :delay="500"
                :style="{
                  '--padding': '6px',
                  '--border-radius': '2px',
                  '--text-color': '#000102',
                  '--arrow-height': '8px',
                  '--color': 'var(--datav-font-color)',
                  maxWidth: '240px',
                }"
              >
                <template #trigger>
                  <span>{{ usedFilters[dataFilter.id].names.length }} 个组件正在调用</span>
                </template>
                {{ usedFilters[dataFilter.id].names.join(', ') }}
              </n-tooltip>
            </template>
          </div>
          <div class="action-wp" :class="{ '--flex': publish }">
            <template v-if="publish">
              <g-tooltip-popover content="创建代码片段">
                <n-icon class="save-btn">
                  <IconRelease />
                </n-icon>
              </g-tooltip-popover>
            </template>
            <g-tooltip-popover content="删除">
              <n-icon class="del-btn" @click="removeFilter(dataFilter.id)">
                <IconDelete v-if="removable" />
                <IconClose v-else />
              </n-icon>
            </g-tooltip-popover>
          </div>
          <template v-if="hasFeedback">
            <template v-if="errMsg">
              <n-tooltip
                placement="left"
                :style="{
                  '--color': 'var(--datav-error-color)',
                  maxWidth: '300px',
                }"
              >
                <template #trigger>
                  <div class="filter-dot"></div>
                </template>
                {{ errMsg }}
              </n-tooltip>
            </template>
            <div v-else class="filter-dot"></div>
          </template>
          <div v-else class="filter-dot --none"></div>
        </div>
      </div>
      <div class="toggle-btn" @click="toggleEditor">
        <n-icon class="toggle-icon">
          <IconArrowLeft />
        </n-icon>
      </div>
    </div>
    <template v-if="isOpened">
      <n-collapse-transition :show="collapse">
        <div class="panel-content-wp">
          <div class="cp-wrap">
            <p title="function filter(data) {" class="fake-code --start">
              <span class="--keyword">function</span> filter(data) {
            </p>
            <g-monaco-editor
              language="javascript"
              :code="code"
              :height="180"
              editor-class="filter-editor"
              @change="changeCode"
              @blur="updateCode"
            />
            <p class="fake-code --end">}</p>
            <div class="filter-actions">
              <div v-if="isEdited" class="unsaved">未保存</div>
              <div v-else-if="showTime" class="saved">上次保存: {{ dataFilter.updateAt }}</div>
              <n-button
                size="tiny"
                :focusable="false"
                class="bolder-btn"
                @click="cancelEdit"
              >
                {{
                  dataFilter.id === 0 ? '取消' : isEdited ? '撤销' : '取消'
                }}
              </n-button>
              <n-button
                type="primary"
                size="tiny"
                :loading="loading"
                :focusable="false"
                class="bolder-btn"
                @click="saveData"
              >
                {{
                  dataFilter.id === 0 ? '保存' : isEdited ? '保存' : '完成'
                }}
              </n-button>
            </div>
          </div>
        </div>
      </n-collapse-transition>
    </template>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ComputedRef, ref, inject, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { DataFilter } from '@/components/data-filter'
import { IconArrowLeft, IconEdit, IconRelease, IconDelete, IconDrag, IconClose } from '@/icons'

export default defineComponent({
  name: 'FilterCollapsePanel',
  components: {
    IconArrowLeft, IconEdit, IconRelease, IconDelete, IconDrag, IconClose,
  },
  props: {
    dataFilter: {
      type: Object as PropType<DataFilter>,
      required: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    hasFeedback: {
      type: Boolean,
      default: true,
    },
    removable: Boolean,
    publish: Boolean,
    isNew: Boolean,
    index: Number,
    showTime: Boolean,
  },
  setup(props) {
    const nMessage = useMessage()
    const panelRef = ref(null)
    const editing = ref(props.isNew)
    const collapse = ref(props.isNew)
    const isOpened = ref(props.isNew)
    const isEdited = ref(props.isNew)
    const loading = ref(false)
    const code = ref(props.dataFilter.origin)

    const dataStatus = inject('dataStatus', null) as ComputedRef<any>
    const errMsg = computed(() => {
      let msg = ''
      const err = dataStatus?.value.filter
      if (err && err[props.dataFilter.id]) {
        msg = err[props.dataFilter.id]
      }
      return msg
    })

    const usedFilters = inject('usedFilters') as ComputedRef<Record<number, { ids: string[]; names: string[]; }>>
    const enabledFilters = inject('enabledFilters', null) as ComputedRef<Record<number, boolean>>

    const onUsedChange = inject('onUsedChange', null) as (id: number, val: boolean) => void
    const editFilterName = inject('editFilterName') as (val: string, df: DataFilter) => void
    const removeFilter = inject('removeFilter') as (id: number) => void
    const saveFilter = inject('saveFilter') as (data: DataFilter) => Promise<void>
    const updateIndicator = inject('updateIndicator', null) as (visible: boolean, index: number, el: any) => void

    const isEnabled = computed(() => (enabledFilters?.value[props.dataFilter.id] ?? false))

    const switchEnabled = (val: boolean) => {
      onUsedChange(props.dataFilter.id, val)
    }

    const editName = (val: string) => {
      editing.value = false
      editFilterName(val, props.dataFilter)
    }

    const changeCode = (data: any) => {
      if (data.value != props.dataFilter.origin) {
        isEdited.value = true
      }
    }

    const updateCode = (data: any) => {
      code.value = data.value
    }

    const cancelEdit = () => {
      if (props.isNew) {
        removeFilter(0)
      } else {
        code.value = props.dataFilter.origin
        if (isEdited.value) {
          isEdited.value = false
        } else {
          collapse.value = false
        }
      }
    }

    const saveData = async () => {
      if (!isEdited.value) {
        collapse.value = false
        return
      }

      try {
        loading.value = true
        props.dataFilter.origin = code.value
        props.dataFilter.code = `
          if (!data) {  return data; }
          return filter(...arguments);
          function filter(data) {
            ${code.value}
            return data;
          }
        `
        await saveFilter(props.dataFilter)
        isEdited.value = false
        nMessage.success('数据过滤器已保存')
      } catch (error) {
        nMessage.error(error.message)
      } finally {
        loading.value = false
      }
    }

    const toggleEditor = () => {
      isOpened.value = true
      collapse.value = !collapse.value
    }

    const dragStart = (ev: any) => {
      const node = ev.target.parentNode.parentNode.parentNode.parentElement
      const nodewp = document.querySelector('.filter-dragging-wp')
      nodewp.innerHTML = ''
      nodewp.appendChild(node.cloneNode(true))
      ev.dataTransfer.setDragImage(nodewp, 30, 15)
    }

    const dragEnd = () => {
      const nodewp = document.querySelector('.filter-dragging-wp')
      nodewp.innerHTML = ''
      updateIndicator(false, props.index, panelRef.value)
    }

    const dragEnter = () => {
      updateIndicator(true, props.index, panelRef.value)
    }

    return {
      panelRef,
      code,
      loading,
      editing,
      collapse,
      isOpened,
      isEdited,
      isEnabled,
      usedFilters,
      errMsg,
      loading2: ref(false),
      switchEnabled,
      editName,
      removeFilter,
      changeCode,
      updateCode,
      cancelEdit,
      saveData,
      toggleEditor,
      dragStart,
      dragEnd,
      dragEnter,
    }
  },
})
</script>
