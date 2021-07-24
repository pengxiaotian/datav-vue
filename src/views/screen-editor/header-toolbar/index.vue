<template>
  <div class="datav-header">
    <div class="head-btn-group view-btn-group">
      <el-tooltip
        content="画布编辑器"
        effect="blue"
        :open-delay="500"
        :enterable="false"
      >
        <div class="head-btn --selected">
          <i class="v-icon-editor-canvas head-btn-icon"></i>
        </div>
      </el-tooltip>
      <el-tooltip
        content="蓝图编辑器"
        effect="blue"
        :open-delay="500"
        :enterable="false"
      >
        <div class="head-btn --disabled">
          <i class="v-icon-nodal head-btn-icon"></i>
        </div>
      </el-tooltip>
    </div>
    <div class="datav-edit-header">
      <div class="editor-header-wp">
        <div class="editor-config">
          <el-tooltip
            content="图层"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div
              :class="['head-btn mr4', { '--selected': layer }]"
              @click="changeLayerPanel"
            >
              <i class="v-icon-layer head-btn-icon"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            content="组件列表"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div
              :class="['head-btn mr4', { '--selected': components }]"
              @click="changeComponentsPanel"
            >
              <i :class="['v-icon-box com-list-icon', { '--rotate': !components }]"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            content="右侧面板"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div
              :class="['head-btn mr4', { '--selected': config }]"
              @click="changeConfigPanel"
            >
              <i class="v-icon-rpanel head-btn-icon"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            content="工具箱"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div
              :class="['head-btn mr4', { '--selected': toolbox }]"
              @click="changeToolboxPanel"
            >
              <i class="v-icon-toolbox head-btn-icon"></i>
            </div>
          </el-tooltip>
        </div>
        <div class="drawer-actions">
          <el-tooltip
            content="数据过滤器"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div
              :class="['head-btn mr4', { '--selected': filter }]"
              @click="changeFilterPanel"
            >
              <i class="v-icon-filter head-btn-icon"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            content="美化工具箱"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div :class="['head-btn mr4']">
              <i class="v-icon-magic head-btn-icon"></i>
            </div>
          </el-tooltip>
          <el-tooltip
            content="迁移至移动端"
            effect="blue"
            :open-delay="500"
            :enterable="false"
          >
            <div :class="['head-btn mr4']">
              <i class="v-icon-mobile head-btn-icon"></i>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="screen-info">
        <i class="v-icon-workspace workspace-icon" @click="goHome"></i>
        <span>{{ '工作空间 - ' + screen.name }}</span>
      </div>
      <div class="global-actions">
        <el-tooltip
          content="生成快照"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <div class="head-btn ml4" @click="saveScreen">
            <i class="v-icon-snapshot head-btn-icon"></i>
          </div>
        </el-tooltip>
        <el-tooltip
          content="帮助"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <div class="head-btn ml4">
            <router-link
              :to="{ name: 'MyCase' }"
              target="_blank"
              class="full-a"
            >
              <i class="v-icon-help head-btn-icon"></i>
            </router-link>
          </div>
        </el-tooltip>
        <el-tooltip
          content="发布"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <div class="head-btn ml4" @click="goPublish">
            <i class="v-icon-release head-btn-icon"></i>
          </div>
        </el-tooltip>
        <el-tooltip
          content="预览"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <div class="head-btn ml4" @click="goPreview">
            <i class="v-icon-preview head-btn-icon"></i>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
  <head-loading />
  <publish-screen v-model="visiblePublish" :project-id="publishAppId" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { FilterModule } from '@/store/modules/filter'
import { EditorModule } from '@/store/modules/editor'
import { saveScreen } from '@/api/screen'
import { MessageUtil } from '@/utils/message-util'
import HeadLoading from './head-loading.vue'
import PublishScreen from '../../my-project/publish-screen.vue'

export default defineComponent({
  name: 'HeaderToolber',
  components: {
    HeadLoading,
    PublishScreen,
  },
  data() {
    return {
      visiblePublish: false,
      publishAppId: 0,
    }
  },
  computed: {
    screen() {
      return EditorModule.screen
    },
    layer() {
      return ToolbarModule.layer.show
    },
    components() {
      return ToolbarModule.components.show
    },
    config() {
      return ToolbarModule.config.show
    },
    toolbox() {
      return ToolbarModule.toolbox.show
    },
    filter() {
      return ToolbarModule.filter.show
    },
  },
  methods: {
    changeLayerPanel() {
      ToolbarModule.setPanelState({ type: PanelType.layer, value: !this.layer })
    },
    changeComponentsPanel() {
      ToolbarModule.setPanelState({ type: PanelType.components, value: !this.components })
    },
    changeConfigPanel() {
      ToolbarModule.setPanelState({ type: PanelType.config, value: !this.config })
    },
    changeToolboxPanel() {
      ToolbarModule.setPanelState({ type: PanelType.toolbox, value: !this.toolbox })
    },
    changeFilterPanel() {
      ToolbarModule.filter.show = !this.filter
    },
    goHome() {
      const route = this.$router.resolve('/')
      window.open(route.href, '_blank', 'noopener=yes,noreferrer=yes')
    },
    goPublish() {
      this.visiblePublish = true
      this.publishAppId = this.screen.id
    },
    async saveScreen() {
      ToolbarModule.addLoading()
      try {
        const data = {
          project: {
            ...EditorModule.screen,
            config: {
              ...EditorModule.pageConfig,
            },
          },
          dataFilters: [...FilterModule.dataFilters],
          coms: [
            ...EditorModule.coms,
            ...EditorModule.subComs,
          ],
        }
        await saveScreen(data)
        MessageUtil.success('大屏已保存')
      } catch (error) {
        MessageUtil.error(`保存大屏失败：${error}`)
      } finally {
        ToolbarModule.removeLoading()
      }
    },
    async goPreview() {
      await this.saveScreen()

      const route = this.$router.resolve({
        name: 'Preview',
        params: {
          screenId: this.screen.id,
        },
      })
      const a = document.createElement('a')
      a.rel = 'noopener, noreferrer'
      a.href = route.href
      a.target = '_blank'
      a.click()
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.datav-header {
  position: relative;
  height: 41px;
  padding-right: 8px;
  display: flex;
  z-index: 100;
  align-items: center;
  user-select: none;
  color: $header-color;
  background: $header-bgcolor;
  border-bottom: $border-dark;

  .view-btn-group {
    margin: 0 15px;
    z-index: 1;
  }
}

.head-btn {
  width: 40px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  background: $header-btn-bgcolor;
  box-shadow:
    inset 0 0 0 1px rgba(255, 235, 235, 0.1),
    0 0 0 1px #181818;
  transition: 0.2s;

  .head-btn-icon {
    color: $header-icon-color;

    &:not(:first-child) {
      border-left: 1px solid rgba(255, 235, 235, 0.1);
    }
  }

  &:not(.--disabled):hover {
    background: $header-btn-bgcolor-hover;
  }

  &.--selected {
    background: $color-primary;

    & + .head-btn {
      border-left-color: transparent;
    }

    &:not(.--disabled):hover {
      background: $color-primary;
    }
  }

  &.--disabled {
    cursor: not-allowed;

    .head-btn-icon {
      opacity: 0.2;
    }
  }
}

.head-btn-group {
  display: flex;
  box-sizing: border-box;
  background: $header-bgcolor;
  border: 1px solid rgba(255, 235, 235, 0.1);
  box-shadow: 0 0 0 1px #181818;

  .head-btn {
    width: 45px;
    border-radius: 0;
    box-shadow: none;
    height: 22px;
    line-height: 22px;
    border-left: 1px solid transparent;
  }
}

.datav-edit-header {
  width: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  height: 40px;
  z-index: 100;

  .editor-header-wp {
    display: flex;
    overflow: hidden;
    transition: width 0.3s ease;
  }

  .editor-config {
    display: flex;
    width: 300px;
    align-items: center;
    transition: 0.3s ease;
  }

  .drawer-actions {
    width: 90px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  .com-list-icon {
    display: inline-block;
    color: $header-icon-color;

    &.--rotate {
      animation: com-rotate 2s infinite;
      animation-direction: alternate-reverse;
    }
  }

  .screen-info {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    text-align: center;
    cursor: default;
    font-size: 14px;
    max-width: 500px;
    color: $header-color;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .workspace-icon {
      padding-right: 8px;
      cursor: pointer;
    }
  }

  .global-actions {
    position: absolute;
    top: 0;
    right: 8px;
    width: 300px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
  }

  .full-a {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }

  .ml4 {
    margin-left: 4px;
  }

  .mr4 {
    margin-right: 4px;
  }
}

@keyframes com-rotate {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
</style>
