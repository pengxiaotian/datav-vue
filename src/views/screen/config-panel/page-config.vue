<template>
  <div class="config-manager-page">
    <div class="config-manager-head">页面设置</div>
    <div class="config-manager-body">
      <div class="page-config">
        <div class="page-config-wp">
          <g-field label="屏幕大小" :nest="true">
            <g-field label="宽度" :level="2">
              <el-input-number
                v-model="pageConfig.width"
                size="mini"
                :min="100"
                :max="20000"
              />
            </g-field>
            <g-field label="高度" :level="2">
              <el-input-number
                v-model="pageConfig.height"
                size="mini"
                :min="100"
                :max="20000"
              />
            </g-field>
          </g-field>

          <g-field label="背景颜色">
            <!-- <aui-color-picker v-model="pageConfig.bgcolor" /> -->
          </g-field>
          <g-field label="背景图">
            <!-- <aui-upload v-model="pageConfig.bgimage" /> -->
          </g-field>
          <g-field label="重置">
            <el-button size="mini" @click="resetBGImage">
              恢复默认背景
            </el-button>
          </g-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { EditorModule } from '@/store/modules/editor'
import { bgImg } from '@/data/images'

export default defineComponent({
  name: 'PageConfig',
  setup() {
    const selectedCom = computed(() => EditorModule.selectedCom)
    const pageConfig = computed(() => EditorModule.pageConfig)

    const resetBGImage = () => {
      pageConfig.value.bgimage = bgImg
    }

    return {
      selectedCom,
      pageConfig,
      resetBGImage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.config-manager-page {
  height: 100%;
  background: $config-manager-bgcolor;
  user-select: none;

  .config-manager-head {
    width: 100%;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    color: $panel-font-color;
    text-align: center;
    background: $layer-bgcolor;
    user-select: none;
  }

  .config-manager-body {
    width: 100%;
    height: 100%;
    padding-top: 36px;
    margin-top: -36px;
  }
}

.page-config {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 12px;
  color: $page-config-font-color;
  background: $page-config-bgcolor;
}

.page-config-wp {
  position: relative;
  padding-top: 6px;
  padding-bottom: 6px;

  &:not(:last-child)::after {
    position: absolute;
    bottom: 1px;
    left: 6%;
    width: 91%;
    height: 1px;
    background: $page-config-secondary-bgcolor;
    content: '';
  }
}

.page-config-zoom:not(:last-child) {
  margin-bottom: 5px;
}

.screen-preview {
  position: relative;
  width: 182px;
  height: 108px;
  margin-top: 8px;

  img {
    width: 100%;
    height: 100%;
  }

  .screen-preview-paste {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: 0 0;
    border: $border-outline;
    transition: border-color 0.2s;

    &:hover {
      border-color: $color-primary;
    }
  }
}
</style>
