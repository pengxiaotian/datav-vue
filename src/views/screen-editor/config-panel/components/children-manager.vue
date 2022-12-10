<template>
  <div v-if="isSupportedSubCom" class="children-manager">
    <div class="children-manager-title">
      <div>
        <n-popover
          v-model:show="showManagerPopover"
          :show-arrow="false"
          trigger="click"
          placement="left-start"
          raw
          style="--n-space: 1px;"
        >
          <template #trigger>
            <div class="add-child-icon-wrapper" title="添加子组件">
              <n-icon :size="13">
                <IconPlus />
              </n-icon>
            </div>
          </template>
          <div class="children-manager-selector">
            <div class="children-manager-selector-component">
              <div
                v-for="sm in sysSubComs"
                :key="sm.name"
                class="children-manager-selector-option"
                :class="selectedItems.includes(sm.name) ? 'selected' : ''"
                @click="toggleSelectSubMap(sm.name)"
              >
                <img :src="sm.img" class="children-manager-selector-option-image">
                <span class="children-manager-selector-option-name">{{ sm.alias }}</span>
              </div>
            </div>
            <div class="children-manager-selector-info">
              <div class="children-manager-selector-count">
                已选择
                <span style="color: rgb(36 131 255);"> {{ selectedItems.length }} </span>
                个子组件
              </div>
            </div>
            <div class="add-child">
              <n-button
                size="tiny"
                :focusable="false"
                :disabled="selectedItems.length === 0"
                :loading="loading"
                @click="addSubComs"
              >
                <template #icon>
                  <n-icon>
                    <IconPlus />
                  </n-icon>
                </template>
                添加子组件
              </n-button>
            </div>
          </div>
        </n-popover>
        <span class="children-manager-name">子组件管理</span>
      </div>
      <div>
        <span
          v-for="(m, idx) in tagColors"
          :key="idx"
          class="children-manager-color-tag-wrapper --anormal"
          :class="{ '--selected': filterTag === idx }"
          @click="selectTag(idx)"
        >
          <i class="children-manager-color-tag" :style="m"></i>
        </span>
      </div>
    </div>
    <div class="children-manager-list">
      <div class="children-list-container">
        <div
          v-for="(item, aidx) in subComs"
          :key="item.id"
          class="children-item"
          :class="{ entering: dragInfo.toIdx === aidx }"
          @dragenter="dragEnter(item.id, aidx)"
          @dragover="dragOver"
        >
          <div>
            <div title="更改标签">
              <n-popover
                :show-arrow="false"
                trigger="click"
                placement="bottom-start"
                raw
              >
                <template #trigger>
                  <span class="children-manager-color-tag-wrapper">
                    <i class="children-manager-color-tag" :style="tagColors[item.tag]"></i>
                  </span>
                </template>
                <div class="children-manager-tag-panel">
                  <span
                    v-for="(m, idx) in tagColors"
                    :key="idx"
                    class="children-manager-color-tag-wrapper"
                    @click="item.tag = idx"
                  >
                    <i class="children-manager-color-tag" :style="m"></i>
                  </span>
                </div>
              </n-popover>
            </div>
            <input
              v-if="item.renameing"
              v-model.trim="item.alias"
              v-focus
              class="com-alias-ipt"
              @blur="item.renameing = false"
              @keydown.enter="item.renameing = false"
            >
            <template v-else>
              <a
                draggable="false"
                href="javascript:;"
                class="com-alias-text"
                @click="selectSubCom(item)"
              >
                {{ item.alias }}
              </a>
              <div title="点击隐藏" @click="item.hided = !item.hided">
                <n-icon v-if="item.hided" class="child-status-btn">
                  <IconHide />
                </n-icon>
                <n-icon v-else class="child-status-btn">
                  <IconShow />
                </n-icon>
              </div>
            </template>
          </div>
          <div>
            <span title="复制" class="child-btn" @click="copySubCom(item.id)">
              <n-icon>
                <IconCopy />
              </n-icon>
            </span>
            <span title="重命名" class="child-btn" @click="item.renameing = true">
              <n-icon>
                <IconEdit />
              </n-icon>
            </span>
            <span title="删除" class="child-btn" @click="confirmDeleteSubCom(item)">
              <n-icon>
                <IconDelete />
              </n-icon>
            </span>
            <span
              title="排序"
              class="child-btn"
              draggable="true"
              @dragstart="dragStart($event, item.id)"
              @dragend="dragEnd"
            >
              <n-icon>
                <IconDrag />
              </n-icon>
            </span>
          </div>
        </div>
        <div
          v-if="subComs.length > 0"
          class="children-item last-placeholder"
          :class="{ entering: dragInfo.toIdx === subComs.length }"
          @dragenter="dragEnter('', subComs.length)"
          @dragover="dragOver"
        ></div>
        <div v-else class="children-manager-child-not-exist">
          {{ filterTag > -1 ? '过滤结果为空' : '子组件列表为空' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, computed, ref, inject } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import { IconPlus, IconShow, IconHide, IconCopy, IconEdit, IconDelete, IconDrag, IconWarning } from '@/icons'
import { supportedSubComs, getSystemSubComs } from '@/data/system-components'
import { useComStore } from '@/store/com'
import { createComponent } from '@/components/datav'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { loadSubComs } from '@/components/_utils/component-util'
import { comInjectionKey } from '../config'

const tagColors = [
  'background: rgb(28, 31, 37); border-color: rgb(151, 151, 151);',
  'background: rgb(0, 186, 255);',
  'background: rgb(61, 231, 201);',
  'background: rgb(255, 134, 55);',
  'background: rgb(255, 59, 45);',
  'background: rgb(178, 215, 127);',
  'background: rgb(0, 127, 255);',
]

const nDialog = useDialog()
const nMessage = useMessage()
const com = inject(comInjectionKey)
const comStore = useComStore()

const showManagerPopover = ref(false)
const loading = ref(false)
const filterTag = ref(-1)
const selectedItems = ref<string[]>([])
const dragInfo = ref({
  from: '',
  to: '',
  toIdx: -1,
})

const isSupportedSubCom = computed(() => supportedSubComs.includes(com.value.name))
const subComs = computed(() => {
  const list = comStore.subComs.filter(m => m.parentId === com.value.id)
  if (filterTag.value > -1) {
    if (filterTag.value === 0) {
      return list.filter(m => !m.tag)
    }

    return list.filter(m => m.tag === filterTag.value)
  }
  return list
})

const sysSubComs = computed(() => {
  return getSystemSubComs(com.value.name)
})

const toggleSelectSubMap = (name: string) => {
  if (selectedItems.value.includes(name)) {
    selectedItems.value = selectedItems.value.filter(m => m !== name)
  } else {
    selectedItems.value.push(name)
  }
}

const selectTag = (tag: number) => {
  filterTag.value = filterTag.value === tag ? -1 : tag
}

const addSubComs = async () => {
  try {
    loading.value = true
    const coms = await Promise.all(selectedItems.value.map(m => createComponent(m)))
    await loadSubComs(com.value, coms)
    showManagerPopover.value = false
    selectedItems.value = []
  } catch (error) {
    nMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const confirmDeleteSubCom = (com: DatavComponent) => {
  const d = nDialog.create({
    content: `删除后可能无法恢复，是否删除${com.alias}`,
    negativeText: '取消',
    positiveText: '确定',
    iconPlacement: 'top',
    icon: () => h(IconWarning),
    onPositiveClick: async () => {
      d.loading = true
      try {
        await comStore.delete(com)
      } catch (error) {
        nMessage.error(error.message)
      }
    },
  })
}

const copySubCom = (id: string) => {
  comStore.copy(id, ComType.subCom)
}

const selectSubCom = (com: DatavComponent) => {
  comStore.selectSubCom(com.id)
}

const dragStart = (ev: any, id: string) => {
  dragInfo.value.from = id
  const node = ev.target.parentNode.parentNode
  ev.dataTransfer.setDragImage(node, 308, 15)
}

const dragEnd = () => {
  const { from, to, toIdx } = dragInfo.value
  const isEnd = toIdx === subComs.value.length
  const toId = isEnd ? subComs.value[toIdx - 1].id : to
  comStore.sortSubCom(from, toId, isEnd)
  dragInfo.value = {
    from: '',
    to: '',
    toIdx: -1,
  }
}

const dragEnter = (id: string, idx: number) => {
  dragInfo.value.to = id
  dragInfo.value.toIdx = idx
}

const dragOver = (ev: DragEvent) => {
  ev.preventDefault()
  ev.stopPropagation()
  ev.dataTransfer.dropEffect = 'copy'
}
</script>

<style lang="scss" scoped>
.children-manager {
  font-size: 12px;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

.children-manager-title {
  height: 39px;
  line-height: 39px;
  position: relative;
  color: #fff;
  border-top: var(--datav-config-border);
  background: var(--datav-layer-item-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
  }

  .add-child-icon-wrapper {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    transition: transform 0.25s ease-in-out;
    cursor: pointer;

    &:hover {
      color: var(--datav-main-color);
      transform: rotate(90deg);
    }
  }

  .children-manager-name {
    position: absolute;
    left: 18px;
  }
}

.children-manager-list {
  background: #15171c;

  .children-list-container {
    position: relative;

    .children-item {
      height: 35px;
      line-height: 35px;
      font-size: 12px;
      color: var(--datav-font-color);
      border-top: var(--datav-config-border);
      border-bottom: 1px solid transparent;
      padding-right: 12px;
      padding-left: 20px;
      border-left: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      transition: 0.2s;

      > div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;

        &:nth-child(2) {
          right: 12px;
        }
      }

      &.last-placeholder {
        border: var(--datav-config-border);
        border-width: 0;
        border-width: 1px 0;
        height: 0;
      }

      .com-alias-text {
        text-decoration: none;
        color: var(--datav-font-color);
        transition: color 0.2s;
        display: inline-block;
        max-width: 155px;
        margin-right: 5px;
        background: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
          color: var(--datav-main-color);
        }
      }

      .com-alias-ipt {
        background: var(--datav-data-form-bgcolor);
        border: var(--datav-config-border);
        color: var(--datav-font-color);
        line-height: 21px;
        width: 170px;
        text-indent: 5px;
      }

      .child-status-btn {
        font-size: 14px;
        cursor: pointer;
        padding: 0 2px;

        &:hover {
          color: var(--datav-main-color);
        }
      }

      .child-btn {
        height: 35px;
        width: 20px;
        line-height: 35px;
        cursor: pointer;
        color: #fff;
        display: block;
        text-align: center;
        visibility: hidden;

        &:hover {
          color: var(--datav-main-color);
        }
      }

      &.entering {
        border-top: 1px solid var(--datav-sort-line-border-color) !important;
      }

      &:hover {
        border-left: 2px solid var(--datav-main-color);

        .child-btn {
          visibility: visible;
        }
      }
    }

    &:last-child {
      .last-placeholder {
        border-color: transparent;
      }
    }
  }

  .children-manager-child-not-exist {
    color: var(--datav-gray-color);
    height: 35px;
    line-height: 35px;
    border-top: var(--datav-config-border);
    padding-left: 20px;
  }
}

.children-manager-tag-panel {
  height: 24px;
  padding-left: 6px;
  background: var(--datav-menu-bg);
  border: var(--datav-config-border);
  display: flex;
  align-items: center;
}

.children-manager-color-tag-wrapper {
  display: flex;
  height: 13px;
  width: 13px;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  border-radius: 2px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s;

  .children-manager-color-tag {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 2px;
    border: 1px solid transparent;
    opacity: 1;
  }

  &.--anormal .children-manager-color-tag {
    opacity: 0.3;
  }

  &.--selected .children-manager-color-tag {
    opacity: 1;
  }

  &:hover {
    background: rgb(255 255 255 / 15%);
  }
}

.children-manager-selector {
  width: 290px;
  max-height: 100%;
  padding: 10px;
  background: #21242b;
  font-size: 12px;
  box-sizing: content-box;
  z-index: 5;

  .children-manager-selector-component {
    display: flex;
    flex-wrap: wrap;
    border-bottom: var(--datav-config-border);
    max-height: 400px;
    overflow-y: scroll;

    .children-manager-selector-option {
      width: 90px;
      margin-right: 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      position: relative;

      &:nth-child(3n) {
        margin-right: 0;
      }

      .children-manager-selector-option-image {
        width: 100%;
        height: 90px;
        background: var(--datav-cm-add-list-item-bg-color);
        box-sizing: border-box;
        border: 1px solid transparent;
        display: block;
        cursor: pointer;
        transition: border 0.2s;

        &:hover {
          border: 1px solid var(--datav-main-color);
        }
      }

      .children-manager-selector-option-name {
        display: inline-block;
        width: 100%;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &.selected {
        .children-manager-selector-option-image {
          border: 1px solid var(--datav-main-color);
        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 5px;
          right: 5px;
          width: 10px;
          height: 10px;
          border-radius: 10px;
          background: var(--datav-main-color);
        }
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .children-manager-selector-info {
    display: flex;
    flex-direction: row;

    .children-manager-selector-count {
      flex: auto;
      height: 30px;
      line-height: 30px;
      color: #fff;
    }
  }

  .add-child {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
