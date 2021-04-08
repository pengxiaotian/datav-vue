<template>
  <div class="config-manager-page">
    <div class="config-manager-head">页面设置</div>
    <div class="config-manager-body">
      <div class="page-config">
        <div class="page-config-wp">
          <g-field label="屏幕大小">
            <g-input-number
              v-model="pageConfig.width"
              label="宽度"
              :min="100"
              :max="20000"
            />
            <g-input-number
              v-model="pageConfig.height"
              label="高度"
              :min="100"
              :max="20000"
            />
          </g-field>
          <g-field label="背景颜色">
            <g-color-picker v-model="pageConfig.bgcolor" />
          </g-field>
          <g-field label="背景图">
            <g-upload-image v-model="pageConfig.bgimage" />
          </g-field>
          <g-field label="重置">
            <el-button size="mini" @click="resetBGImage">
              恢复默认背景
            </el-button>
          </g-field>
        </div>

        <div class="page-config-wp">
          <g-field label="页面缩放方式">
            <el-radio-group v-model="pageConfig.zoomMode" size="mini">
              <el-radio-button :label="zoomMode.full">
                <i class="v-icon-fullscreen"></i>
              </el-radio-button>
              <el-radio-button :label="zoomMode.width">
                <i class="v-icon-adapt-width"></i>
              </el-radio-button>
              <el-radio-button :label="zoomMode.height">
                <i class="v-icon-adapt-height"></i>
              </el-radio-button>
              <el-radio-button :label="zoomMode.auto">
                <i class="v-icon-adapt-auto"></i>
              </el-radio-button>
              <el-radio-button :label="zoomMode.disabled">
                <i class="v-icon-stop"></i>
              </el-radio-button>
            </el-radio-group>
          </g-field>
          <g-field label="栅格间距" tooltip="每次移动的距离，单位px">
            <g-input-number v-model="pageConfig.grid" :min="1" :max="20" />
          </g-field>
        </div>

        <div class="page-config-wp">
          <g-field label="缩略图">
            <el-button size="mini">
              截取封面
            </el-button>
            <el-button size="mini">
              上传封面
            </el-button>
            <div class="screen-preview">
              <img :src="coverimg" :style="coverimgStyle">
              <input readonly class="screen-preview-paste">
            </div>
          </g-field>
          <g-field label="使用水印">
            <el-switch v-model="pageConfig.useWatermark" />
          </g-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { EditorModule } from '@/store/modules/editor'
import { bgImg, coverImg } from '@/data/images'
import { ZoomMode } from '@/domains/enums/com-enums'

export default defineComponent({
  name: 'PageConfig',
  setup() {
    const selectedCom = computed(() => EditorModule.selectedCom)
    const pageConfig = computed(() => EditorModule.pageConfig)

    const cover = ref({
      loading: false,
      isPreview: false,
      preview: '',
      display: 'none',
      width: '100%',
      height: '100%',
    })

    const coverimg = computed(() => {
      return cover.value.isPreview
        ? cover.value.preview
        : pageConfig.value.screenshot || coverImg
    })

    const coverimgStyle = computed(() => {
      return cover.value.isPreview || pageConfig.value.screenshot
        ? ''
        : 'object-fit: contain; opacity: 0.25; filter: grayscale(1);'
    })

    const resetBGImage = () => {
      pageConfig.value.bgimage = bgImg
    }

    return {
      selectedCom,
      pageConfig,
      zoomMode: ZoomMode,
      coverimg,
      coverimgStyle,
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
