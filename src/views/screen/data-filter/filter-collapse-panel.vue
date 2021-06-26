<template>
  <div
    ref="panelRef"
    class="collapse-panel-wp filter-item ds-panel-filter"
    :class="{
      '--create': isNew,
      '--spread': collapse || isNew,
      '--draggable': !isNew,
      '--unused': !isEnabled,
      '--error': !!errMsg,
    }"
    @dragenter="dragEnter"
  >
    <div class="panel-header">
      <div class="panel-title">
        <div class="filter-title">
          <template v-if="!isNew">
            <i
              class="v-icon-drag drag-btn"
              draggable="true"
              @dragstart="dragStart"
              @dragend="dragEnd"
            ></i>
            <el-checkbox
              :model-value="isEnabled"
              class="enable-checkbox"
              @change="switchEnabled"
            />
          </template>
          <div class="filter-name">
            <g-input
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
              <i class="v-icon-edit edit-btn" @click="editing = true"></i>
            </g-tooltip-popover>
          </div>
          <div class="filter-count">
            <template v-if="!isNew">
              <el-tooltip
                :content="usedFilters[dataFilter.id].join(', ')"
                effect="blue"
                :enterable="false"
                placement="top"
                :open-delay="500"
                popper-class="filter-dep-info"
              >
                <span>{{ usedFilters[dataFilter.id].length }} 个组件正在调用</span>
              </el-tooltip>
            </template>
          </div>
          <div class="action-wp">
            <g-tooltip-popover content="删除">
              <i class="v-icon-close del-btn" @click="removeFilter(dataFilter.id)"></i>
            </g-tooltip-popover>
          </div>
          <template v-if="isEnabled">
            <template v-if="errMsg">
              <el-tooltip
                :content="errMsg"
                effect="blue"
                :enterable="false"
                placement="left"
                popper-class="is-error"
              >
                <div class="filter-dot"></div>
              </el-tooltip>
            </template>
            <div v-else class="filter-dot"></div>
          </template>
          <div v-else class="filter-dot" :class="{ '--none': isNew }"></div>
        </div>
      </div>
      <div class="toggle-btn" @click="toggleEditor">
        <i class="el-icon-arrow-right toggle-icon"></i>
      </div>
    </div>
    <template v-if="isOpened">
      <el-collapse-transition>
        <div v-show="collapse" class="panel-content-wp">
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
              <el-button size="mini" class="bolder-btn" @click="cancelEdit">
                {{
                  dataFilter.id === 0 ? '取消' : isEdited ? '撤销' : '取消'
                }}
              </el-button>
              <el-button
                type="primary"
                size="mini"
                class="bolder-btn"
                :loading="loading"
                @click="saveData"
              >
                {{
                  dataFilter.id === 0 ? '保存' : isEdited ? '保存' : '完成'
                }}
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </template>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ComputedRef, ref, inject, computed } from 'vue'
import { MessageUtil } from '@/utils/message-util'
import { DataFilter } from '@/components/data-filter'

export default defineComponent({
  name: 'FilterCollapsePanel',
  props: {
    dataFilter: {
      type: Object as PropType<DataFilter>,
      required: true,
    },
    isNew: Boolean,
    index: Number,
  },
  setup(props) {
    const panelRef = ref(null)
    const editing = ref(props.isNew)
    const collapse = ref(props.isNew)
    const isOpened = ref(props.isNew)
    const isEdited = ref(props.isNew)
    const loading = ref(false)
    const code = ref(props.dataFilter.origin)

    const dataStatus = inject('dataStatus') as ComputedRef<any>
    const errMsg = computed(() => {
      let msg = ''
      const err = dataStatus.value.errFilter
      if (err && err[props.dataFilter.id]) {
        msg = err[props.dataFilter.id]
      }
      return msg
    })

    const usedFilters = inject('usedFilters') as ComputedRef<Record<number, string[]>>
    const enabledFilters = inject('enabledFilters') as ComputedRef<Record<number, boolean>>

    const onUsedChange = inject('onUsedChange') as (id: number, val: boolean) => void
    const editFilterName = inject('editFilterName') as (val: string, df: DataFilter) => void
    const removeFilter = inject('removeFilter') as (id: number) => void
    const saveFilter = inject('saveFilter') as (data: DataFilter) => Promise<void>
    const updateIndicator = inject('updateIndicator') as (visible: boolean, index: number, el: any) => void

    const isEnabled = computed(() => (enabledFilters.value[props.dataFilter.id] ?? false))

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
        collapse.value = false
        isEdited.value = false
      } catch (error) {
        MessageUtil.error(MessageUtil.format(error))
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
      enabledFilters,
      errMsg,
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
