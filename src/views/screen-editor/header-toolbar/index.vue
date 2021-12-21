<template>
  <div class="datav-header">
    <div class="head-btn-group view-btn-group">
      <n-tooltip :delay="500">
        <template #trigger>
          <div class="head-btn --selected">
            <n-icon class="head-btn-icon">
              <IconEditorCanvas />
            </n-icon>
          </div>
        </template>
        画布编辑器
      </n-tooltip>
      <n-tooltip :delay="500">
        <template #trigger>
          <div class="head-btn --disabled">
            <n-icon class="head-btn-icon">
              <IconNodal />
            </n-icon>
          </div>
        </template>
        蓝图编辑器
      </n-tooltip>
    </div>
    <div class="datav-edit-header">
      <div class="editor-header-wp">
        <div class="editor-config">
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': layer }]"
                @click="changeLayerPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconLayer />
                </n-icon>
              </div>
            </template>
            图层
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': components }]"
                @click="changeComponentsPanel"
              >
                <n-icon class="head-btn-icon" :class="{ '--rotate': !components }">
                  <IconBox />
                </n-icon>
              </div>
            </template>
            组件列表
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': config }]"
                @click="changeConfigPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconRpanel />
                </n-icon>
              </div>
            </template>
            右侧面板
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': toolbox }]"
                @click="changeToolboxPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconToolbox />
                </n-icon>
              </div>
            </template>
            工具箱
          </n-tooltip>
        </div>
        <div class="drawer-actions">
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': filter }]"
                @click="changeFilterPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconFilter />
                </n-icon>
              </div>
            </template>
            数据过滤器
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div :class="['head-btn mr4']">
                <n-icon class="head-btn-icon">
                  <IconMagic />
                </n-icon>
              </div>
            </template>
            美化工具箱
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div :class="['head-btn mr4']">
                <n-icon class="head-btn-icon">
                  <IconMobile />
                </n-icon>
              </div>
            </template>
            迁移至移动端
          </n-tooltip>
        </div>
      </div>
      <div class="screen-info">
        <n-icon class="workspace-icon" @click="goHome">
          <IconWorkspace />
        </n-icon>
        <span>{{ '工作空间 - ' + screen.name }}</span>
      </div>
      <div class="global-actions">
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="saveScreen">
              <n-icon class="head-btn-icon">
                <IconSnapshot />
              </n-icon>
            </div>
          </template>
          生成快照
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4">
              <router-link
                :to="{ name: 'MyCase' }"
                target="_blank"
                class="full-a"
              >
                <n-icon class="head-btn-icon">
                  <IconHelp />
                </n-icon>
              </router-link>
            </div>
          </template>
          帮助
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="goPublish">
              <n-icon class="head-btn-icon">
                <IconRelease />
              </n-icon>
            </div>
          </template>
          发布
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="goPreview">
              <n-icon class="head-btn-icon">
                <IconPreview />
              </n-icon>
            </div>
          </template>
          预览
        </n-tooltip>
      </div>
    </div>
  </div>
  <head-loading />
  <publish-screen v-model="visiblePublish" :project-id="publishAppId" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { FilterModule } from '@/store/modules/filter'
import { EditorModule } from '@/store/modules/editor'
import { saveScreen } from '@/api/screen'
import {
  IconEditorCanvas,
  IconNodal,
  IconBox,
  IconRpanel,
  IconToolbox,
  IconFilter,
  IconMagic,
  IconMobile,
  IconWorkspace,
  IconSnapshot,
  IconHelp,
  IconLayer,
  IconRelease,
  IconPreview,
} from '@/icons'
import HeadLoading from './head-loading.vue'
import PublishScreen from '../../my-project/publish-screen.vue'

export default defineComponent({
  name: 'HeaderToolber',
  components: {
    HeadLoading,
    PublishScreen,
    IconEditorCanvas,
    IconNodal,
    IconBox,
    IconRpanel,
    IconToolbox,
    IconFilter,
    IconMagic,
    IconMobile,
    IconWorkspace,
    IconSnapshot,
    IconHelp,
    IconLayer,
    IconRelease,
    IconPreview,
  },
  data() {
    return {
      visiblePublish: false,
      publishAppId: 0,
      nMessage: useMessage(),
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
          screen: EditorModule.screen,
          config: EditorModule.pageConfig,
          coms: [
            ...EditorModule.coms,
            ...EditorModule.subComs,
          ],
          variables: EditorModule.variables,
          dataFilters: FilterModule.dataFilters ?? [],
        }
        await saveScreen(data)
        this.nMessage.success('大屏已保存')
      } catch (error) {
        this.nMessage.error(`保存大屏失败：${error}`)
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
.datav-header {
  position: relative;
  height: 41px;
  padding-right: 8px;
  display: flex;
  z-index: 100;
  align-items: center;
  user-select: none;
  color: var(--datav-gui-font-color-base);
  border-bottom: var(--datav-border-dark);
  background: #1d1e1f;

  .view-btn-group {
    margin: 0 15px;
    z-index: 1;
  }
}

.head-btn {
  width: 40px;
  height: 24px;
  padding: 4px 0;
  text-align: center;
  cursor: pointer;
  background: var(--datav-component-bg);
  box-shadow:
    inset 0 0 0 1px rgb(255 235 235 / 10%),
    0 0 0 1px #181818;
  transition: 0.2s;

  .head-btn-icon {
    color: #fff;

    &:not(:first-child) {
      border-left: 1px solid rgb(255 235 235 / 10%);
    }

    &.--rotate {
      animation: com-rotate 2s infinite;
      animation-direction: alternate-reverse;
    }
  }

  &:not(.--disabled):hover {
    background: #414750;
  }

  &.--selected {
    background: var(--datav-main-color);

    & + .head-btn {
      border-left-color: transparent;
    }

    &:not(.--disabled):hover {
      background: var(--datav-main-color);
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
  background: #1d1e1f;
  border: 1px solid rgb(255 235 235 / 10%);
  box-shadow: 0 0 0 1px #181818;

  .head-btn {
    width: 45px;
    border-radius: 0;
    box-shadow: none;
    height: 22px;
    padding: 3px 0;
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

  .screen-info {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    text-align: center;
    cursor: default;
    max-width: 500px;
    color: var(--datav-gui-font-color-base);
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .workspace-icon {
      margin-right: 8px;
      font-size: 14px;
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
