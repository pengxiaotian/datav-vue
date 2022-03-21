<template>
  <div :class="['g-aside component-panel-wp', { '--hide': !visiblePanel }]">
    <div class="components-panel">
      <div class="panel-title">
        <span class="panel-text">{{ visiblePanel ? '全部组件' : '组件' }}</span>
        <n-tooltip :delay="500">
          <template #trigger>
            <n-icon title="搜索" class="btn-icon">
              <IconSearch />
            </n-icon>
          </template>
          搜索
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <n-icon title="收起" class="btn-icon" @click="changeVisible">
              <IconBack />
            </n-icon>
          </template>
          收起
        </n-tooltip>
      </div>
      <div class="components-panel-wrapper" @dragover="dragOver">
        <el-tabs tab-position="left" @tab-click="handleTabClick">
          <el-tab-pane v-for="cate in categories" :key="cate.type">
            <template #label>
              <n-tooltip placement="left" :delay="500">
                <template #trigger>
                  <div>
                    <g-com-icon :icon="cate.icon" class="com-tab-icon" />
                    <span class="com-tab-title">{{ cate.name }}</span>
                  </div>
                </template>
                {{ cate.name }}
              </n-tooltip>
            </template>

            <el-tabs v-if="cate.data.length > 2" tab-position="left" class="el-tabs-l2">
              <el-tab-pane v-for="subcate in cate.data" :key="subcate.type">
                <template #label>
                  <span class="com-tab-title">{{ subcate.name }}</span>
                </template>
                <div class="components-single-menu-wp">
                  <div class="components-single-menu">
                    <ul class="components-single-menu-list">
                      <li
                        v-for="com in subcate.data"
                        :key="com.name"
                        :title="com.alias"
                        :draggable="com.used"
                        class="components-item double"
                        @dragstart="dragStart($event, com.name)"
                        @click="toAddCom(com.name, com.used)"
                      >
                        <div class="components-item-text">{{ com.alias }}</div>
                        <div
                          class="components-item-img"
                          :style="`background-image: url(${com.img});`"
                        ></div>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>

            <div v-else class="components-multi-menu">
              <div class="components-single-menu --wider">
                <ul class="components-single-menu-list">
                  <li
                    v-for="com in cate.data[0].data"
                    :key="com.name"
                    :title="com.alias"
                    :draggable="com.used"
                    class="components-item double"
                    @dragstart="dragStart($event, com.name)"
                    @click="toAddCom(com.name, com.used)"
                  >
                    <div class="components-item-text">{{ com.alias }}</div>
                    <div
                      class="components-item-img"
                      :style="`background-image: url(${com.img});`"
                    ></div>
                  </li>
                </ul>
                <template v-if="cate.data[0].data.length === 0">
                  <div v-if="cate.type === 'favorite'" class="favorite-empty">
                    没有收藏组件
                  </div>
                </template>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'

import 'element-plus/es/components/tabs/style/css'
import 'element-plus/es/components/tab-pane/style/css'
import { ElTabs, ElTabPane } from 'element-plus'

import { PanelType, useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { useBlueprintStore } from '@/store/blueprint'
import { useComStore } from '@/store/com'
import { classifications } from '@/data/system-components'
import { createComponent } from '@/components/datav'
import { IconSearch, IconBack } from '@/icons'

type CategoryType = typeof classifications[0]

export default defineComponent({
  name: 'ComponentsPanel',
  components: {
    IconSearch,
    IconBack,
    ElTabs,
    ElTabPane,
  },
  setup() {
    const nMessage = useMessage()
    const toolbarStore = useToolbarStore()
    const comStore = useComStore()
    const editorStore = useEditorStore()
    const blueprintStore = useBlueprintStore()

    const favoriteComs = ref([])
    const visiblePanel = computed(() => toolbarStore.components.show)

    const cloneCfs: CategoryType[] = cloneDeep(classifications)
    const first = { type: 'all', name: '全部', icon: 'v-icon-view-grid' }

    const categories = computed(() => {
      const list: CategoryType[] = cloneCfs
      list.forEach(item => {
        item.data.unshift({
          ...first,
          data: item.data.flatMap(m => m.data),
        })
      })

      list.push({
        type: 'favorite',
        name: '收藏',
        icon: 'v-icon-favorite',
        data: [{ ...first, data: favoriteComs.value }],
      })

      return list
    })

    const changeVisible = () => {
      toolbarStore.setPanelState(PanelType.components, !visiblePanel.value)
    }

    const handleTabClick = () => {
      if (!visiblePanel.value) {
        toolbarStore.setPanelState(PanelType.components, true)
      }
    }

    const toAddCom = async (comName: string, used: boolean) => {
      if (used) {
        toolbarStore.addLoading()
        const com = await createComponent(comName)
        com.attr.x = Math.floor((editorStore.pageConfig.width - com.attr.w) / 2)
        com.attr.y = Math.floor((editorStore.pageConfig.height - com.attr.h) / 2)
        await comStore.addCom(com)
        comStore.selectCom(com.id)
        toolbarStore.removeLoading()

        if (com.apis.source) {
          await com.loadData()
          nextTick(() => {
            blueprintStore.events[com.id]?.requestData()
          })
        }
      } else {
        nMessage.warning('正在开发中。。。')
      }
    }

    const dragStart = (ev: any, comName: string) => {
      ev.dataTransfer.setData('text', comName)
    }

    const dragOver = (ev: DragEvent) => {
      ev.preventDefault()
      ev.stopPropagation()
      ev.dataTransfer.dropEffect = 'none'
    }

    return {
      visiblePanel,
      categories,
      changeVisible,
      handleTabClick,
      toAddCom,
      dragStart,
      dragOver,
    }
  },
})
</script>

<style lang="scss">
@import './style';
@import './tabs';
</style>
