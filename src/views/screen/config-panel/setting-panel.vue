<template>
  <div class="setting-panel">
    <config-title :com-name="com.name" :com-alias="com.alias">
      <div class="search-config" @click="toSearch">
        <i class="el-icon-search search-icon"></i>
        <span>搜索配置</span>
      </div>
    </config-title>
    <div class="setting-panel-content">
      <div class="scroll-container">
        <basic-setting :key="`${com.id}'_basic-setting`" :attr="com.attr" />
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
import { defineComponent, PropType } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { MessageUtil } from '@/utils/message-util'
import ConfigTitle from './components/config-title.vue'
import BasicSetting from './components/basic-setting.vue'

export default defineComponent({
  name: 'SettingPanel',
  components: {
    ConfigTitle,
    BasicSetting,
  },
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup() {
    const toSearch = () => {
      MessageUtil.warning('正在开发中。。。')
    }

    return {
      toSearch,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.setting-panel {
  position: relative;
  width: 100%;
  height: 100vh;
}

.setting-panel-content {
  position: absolute;
  top: 60px;
  bottom: 120px;
  width: 100%;
  overflow-y: auto;
}

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 534px;
  overflow-x: hidden;
  overflow-y: auto;
}

.search-config {
  position: absolute;
  top: 12px;
  right: 8px;
  display: flex;
  max-width: 140px;
  line-height: 19px;
  color: $color-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  align-items: center;
  flex-direction: row;

  .search-icon {
    margin: 0 4px;
    font-size: 12px;
  }
}
</style>
