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
              <el-tab-pane v-for="subcate in (cate.data as ComDataType[])" :key="subcate.type">
                <template #label>
                  <span class="com-tab-title">{{ subcate.name }}</span>
                </template>
                <div class="components-single-menu-wp">
                  <div class="components-single-menu">
                    <ul class="components-single-menu-list">
                      <li
                        v-for="com in (subcate.data as ComDataDto[])"
                        :key="com.name"
                        :title="com.alias"
                        :draggable="com.used"
                        class="components-item double"
                        @dragstart="dragStart($event, com.name)"
                        @click="toAddCom(com.name, com.used)"
                      >
                        <div class="components-item-text">
                          {{ com.alias }}
                        </div>
                        <div
                          class="components-item-img"
                          :style="`background-image: url(${com.img});`"
                        >
                          <span v-if="!com.used" class="mask" @click.stop>
                            <n-tooltip>
                              <template #trigger>
                                <n-icon class="datav-icon">
                                  <IconLock />
                                </n-icon>
                              </template>
                              正在开发中。。。🚀
                            </n-tooltip>
                          </span>
                        </div>
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
                    v-for="com in ((cate.data[0] as ComDataType).data as ComDataDto[])"
                    :key="com.name"
                    :title="com.alias"
                    :draggable="com.used"
                    class="components-item double"
                    @dragstart="dragStart($event, com.name)"
                    @click="toAddCom(com.name, com.used)"
                  >
                    <div class="components-item-text">
                      {{ com.alias }}
                    </div>
                    <div
                      class="components-item-img"
                      :style="`background-image: url(${com.img});`"
                    >
                      <span v-if="!com.used" class="mask" @click.stop>
                        <n-tooltip>
                          <template #trigger>
                            <n-icon class="datav-icon">
                              <IconLock />
                            </n-icon>
                          </template>
                          正在开发中。。。🚀
                        </n-tooltip>
                      </span>
                    </div>
                  </li>
                </ul>
                <template v-if="(cate.data[0] as ComDataType).data.length === 0">
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

<script lang='ts' setup>
import { ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'

import 'element-plus/es/components/tabs/style/css'
import 'element-plus/es/components/tab-pane/style/css'
import { ElTabs, ElTabPane } from 'element-plus'

import { PanelType, useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { classifications, ComDataType, ComDataDto } from '@/data/system-components'
import { createComponent } from '@/components/datav'
import { loadCom } from '@/components/_utils/component-util'
import { IconSearch, IconBack, IconLock } from '@/icons'

const toolbarStore = useToolbarStore()
const editorStore = useEditorStore()

const favoriteComs = ref([])
const visiblePanel = computed(() => toolbarStore.components.show)

const first: ComDataType = {
  type: 'all',
  name: '全部',
  icon: 'v-icon-view-grid',
  data: [],
}
const cloneCfs = cloneDeep(classifications)
cloneCfs.forEach(item => {
  item.data.unshift({
    ...first,
    data: (item.data as ComDataType[]).flatMap(m => m.data),
  })
})

const categories = computed<ComDataType[]>(() => {
  return [
    ...cloneCfs,
    {
      type: 'favorite',
      name: '收藏',
      icon: 'v-icon-favorite',
      data: [{ ...first, data: favoriteComs.value }],
    },
  ]
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
    await loadCom(com)
    toolbarStore.removeLoading()
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
</script>

<style lang="scss">
@import './style';
@import './tabs';
</style>
