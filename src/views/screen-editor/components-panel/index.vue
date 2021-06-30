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
              <i :class="['com-tab-icon', cate.icon]"></i>
            </el-tooltip>
          </template>
          <el-collapse v-model="cate.expand" accordion>
            <el-collapse-item
              v-for="subcate in cate.data"
              :key="subcate.type"
              :name="subcate.type"
            >
              <template #title>
                <i :class="['collpase-hd-icon', subcate.icon]"></i>
                <span class="collpase-hd-text">
                  {{ subcate.name + ' (' + subcate.data.length + ')' }}
                </span>
              </template>
              <ul class="menu-list">
                <li
                  v-for="com in subcate.data"
                  :key="com.name"
                  :title="com.alias"
                  :draggable="com.used"
                  class="menu-item"
                  @dragstart="dragStart($event, com.name)"
                  @click="toAddCom(com.name, com.used)"
                >
                  <div
                    class="menu-item-img"
                    :style="`background-image: url(${com.img});`"
                  ></div>
                  <p class="menu-item-text">{{ com.alias }}</p>
                </li>
              </ul>
              <template v-if="subcate.data.length === 0">
                <div v-if="cate.type === 'favorite'" class="favorite-empty">
                  没有收藏组件
                </div>
              </template>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-aside>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { MessageUtil } from '@/utils/message-util'
import { classifications } from '@/data/system-components'
import { createComponent } from '@/components/datav'

type CategoryType = { expand?: string; } & typeof classifications[0]

export default defineComponent({
  name: 'ComponentsPanel',
  setup() {
    const searchText = ref('')
    const favoriteComs = ref([])
    const visiblePanel = computed(() => ToolbarModule.components.show)

    const categories = computed(() => {
      const list: CategoryType[] = cloneDeep(classifications)
      const first = { type: 'all', name: '全部', icon: 'v-icon-view-grid' }
      list.forEach(item => {
        item.expand = ''
        if (item.data.length > 1) {
          item.data.unshift({
            ...first,
            data: item.data.flatMap(m => m.data),
          })
        } else {
          item.expand = 'all'
          Object.assign(item.data[0], first)
        }
      })

      list.push({
        type: 'favorite',
        name: '收藏',
        icon: 'v-icon-favorite',
        data: [{ ...first, data: favoriteComs.value }],
        expand: 'all',
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

    const toAddCom = (comName: string, used: boolean) => {
      if (used) {
        const { pageConfig } = EditorModule
        const com = createComponent(comName)
        com.attr.x = Math.floor((pageConfig.width - com.attr.w) / 2)
        com.attr.y = Math.floor((pageConfig.height - com.attr.h) / 2)
        EditorModule.addCom(com)
      } else {
        MessageUtil.warning('正在开发中。。。')
      }
    }

    const dragStart = (ev: any, comName: string) => {
      ev.dataTransfer.setData('text', comName)
      const node = ev.target.childNodes[0]
      ev.dataTransfer.setDragImage(node, node.clientWidth / 2, node.clientHeight / 2)
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
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style';
</style>
