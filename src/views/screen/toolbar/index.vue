<template>
  <el-row class="edit-header-wrap">
    <el-col class="edit-header">
      <el-tooltip content="返回" effect="blue" :enterable="false">
        <div class="back-btn" @click="$router.push('/')">
          <i class="v-icon-back"></i>
        </div>
      </el-tooltip>
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
            :class="['head-btn mr4', { '--selected': comList }]"
            @click="changeComsPanel"
          >
            <i :class="['v-icon-box com-list-icon', { '--rotate': !comList }]"></i>
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
      </div>
      <div class="screen-info">
        <i class="v-icon-workspace workspace-icon"></i>
        <span>{{ '工作空间 - ' + screen.name }}</span>
      </div>
      <div class="global-actions">
        <el-tooltip
          content="保存"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <div class="head-btn ml4">
            <i class="v-icon-save head-btn-icon"></i>
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
          <div class="head-btn ml4">
            <i class="v-icon-release head-btn-icon"></i>
          </div>
        </el-tooltip>
        <el-tooltip
          content="预览"
          effect="blue"
          :open-delay="500"
          :enterable="false"
        >
          <div class="head-btn ml4">
            <router-link
              :to="{ name: 'Screen', params: { projectId: screen.id } }"
              target="_blank"
              class="full-a"
            >
              <i class="v-icon-preview head-btn-icon"></i>
            </router-link>
          </div>
        </el-tooltip>
      </div>
    </el-col>
  </el-row>
  <head-loading />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import HeadLoading from './head-loading.vue'

export default defineComponent({
  name: 'Toolbar',
  components: {
    HeadLoading,
  },
  computed: {
    screen() {
      return EditorModule.screen
    },
    layer() {
      return ToolbarModule.layer.show
    },
    comList() {
      return ToolbarModule.comList.show
    },
    config() {
      return ToolbarModule.config.show
    },
  },
  methods: {
    changeLayerPanel() {
      ToolbarModule.setPanelState({ type: PanelType.layer, value: !this.layer })
    },
    changeComsPanel() {
      ToolbarModule.setPanelState({ type: PanelType.comList, value: !this.comList })
    },
    changeConfigPanel() {
      ToolbarModule.setPanelState({ type: PanelType.config, value: !this.config })
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.edit-header-wrap {
  overflow: hidden;
}

.edit-header {
  position: relative;
  z-index: 100;
  display: flex;
  height: 40px;
  padding-right: 8px;
  align-items: center;
  color: $header-color;
  background: $header-bgcolor;
  border-bottom: $border-dark;
  user-select: none;

  .back-btn {
    width: 40px;
    height: 100%;
    line-height: 40px;
    color: $color-primary;
    text-align: center;
    cursor: pointer;
    border-right: $border-dark;
    transition: 0.2s;

    &:hover {
      background: #22262d;
    }
  }

  .editor-config {
    display: flex;
    width: 170px;
    margin-left: 10px;
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
    top: 0;
    left: 50%;
    max-width: 500px;
    overflow: hidden;
    font-size: 14px;
    line-height: 40px;
    color: $header-color;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
    transform: translateX(-50%);

    .workspace-icon {
      padding-right: 8px;
    }
  }

  .global-actions {
    position: absolute;
    top: 0;
    right: 8px;
    display: flex;
    width: 500px;
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

  &:hover {
    background: $header-btn-hover-bgcolor;
  }

  &.--selected {
    background: $color-primary;
  }

  .head-btn-icon {
    color: $header-icon-color;
  }
}
</style>

<style lang="scss">
@keyframes com-rotate {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
</style>
