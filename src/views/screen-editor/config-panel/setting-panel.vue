<template>
  <div class="setting-panel">
    <config-title>
      <div class="search-config" @click="toSearch">
        <n-icon class="search-icon">
          <IconSearch />
        </n-icon>
        <span>搜索配置</span>
      </div>
    </config-title>
    <div class="setting-panel-content">
      <children-manager />
      <div class="scroll-container">
        <basic-setting
          v-if="com.type === ComType.com"
          :key="com.id"
          :attr="com.attr"
        />
        <component
          :is="com.name + 'Prop'"
          :key="com.id"
          :com="com"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, inject } from 'vue'
import { useMessage } from 'naive-ui'
import { ComType } from '@/components/_models/datav-component'
import { IconSearch } from '@/icons'
import { comInjectionKey } from './config'
import ConfigTitle from './components/config-title.vue'
import BasicSetting from './components/basic-setting.vue'
import ChildrenManager from './components/children-manager.vue'

export default defineComponent({
  name: 'SettingPanel',
  components: {
    IconSearch,
    ConfigTitle,
    BasicSetting,
    ChildrenManager,
  },
  setup() {
    const nMessage = useMessage()
    const com = inject(comInjectionKey)

    const toSearch = () => {
      nMessage.warning('正在开发中。。。')
    }

    return {
      ComType,
      com,
      toSearch,
    }
  },
})
</script>

<style lang="scss" scoped>
.setting-panel {
  position: relative;
  width: 100%;
  height: 100%;
}

.setting-panel-content {
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 66px;
  overflow-y: auto;
}

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 534px;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.search-config {
  position: absolute;
  top: 12px;
  right: 8px;
  display: flex;
  max-width: 140px;
  line-height: 19px;
  color: var(--datav-main-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  align-items: center;
  flex-direction: row;

  .search-icon {
    margin: 0 4px;
  }
}
</style>
