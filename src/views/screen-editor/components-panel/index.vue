<template>
  <el-aside width="auto" :class="['component-panel-wp', { '--hide': !visiblePanel }]">
    <div class="components-panel">
      <div class="panel-title">
        <span class="panel-text">{{ visiblePanel ? '全部组件' : '组件' }}</span>
        <el-tooltip
          content="搜索"
          placement="top"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <i title="搜索" class="v-icon-search btn-icon"></i>
        </el-tooltip>
        <el-tooltip
          content="收起"
          placement="top"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <i title="收起" class="v-icon-back btn-icon" @click="changeVisible"></i>
        </el-tooltip>
      </div>
      <div class="components-panel-wrapper" @dragover="dragOver">
        <el-tabs tab-position="left" @tab-click="handleTabClick">
          <el-tab-pane v-for="cate in categories" :key="cate.type">
            <template #label>
              <el-tooltip
                :content="cate.name"
                placement="right"
                effect="blue"
                :open-delay="500"
                :enterable="false"
              >
                <div>
                  <i :class="['com-tab-icon', cate.icon]"></i>
                  <span class="com-tab-title">{{ cate.name }}</span>
                </div>
              </el-tooltip>
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
  </el-aside>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { BlueprintModule } from '@/store/modules/blueprint'
import { classifications } from '@/data/system-components'
import { createComponent } from '@/components/datav'

type CategoryType = typeof classifications[0]

export default defineComponent({
  name: 'ComponentsPanel',
  setup() {
    const nMessage = useMessage()
    const searchText = ref('')
    const favoriteComs = ref([])
    const visiblePanel = computed(() => ToolbarModule.components.show)

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
      ToolbarModule.setPanelState({ type: PanelType.components, value: !visiblePanel.value })
    }

    const handleTabClick = () => {
      if (!visiblePanel.value) {
        ToolbarModule.setPanelState({ type: PanelType.components, value: true })
      }
    }

    const toAddCom = async (comName: string, used: boolean) => {
      if (used) {
        ToolbarModule.addLoading()
        const { pageConfig } = EditorModule
        const com = createComponent(comName)
        com.attr.x = Math.floor((pageConfig.width - com.attr.w) / 2)
        com.attr.y = Math.floor((pageConfig.height - com.attr.h) / 2)
        await EditorModule.addCom(com)
        EditorModule.selectCom(com.id)
        ToolbarModule.removeLoading()

        if (com.apis.source) {
          await com.loadData()
          BlueprintModule.datavComponents[com.id].$DATAV_requestData()
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
      searchText,
      favoriteComs,
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
</style>
