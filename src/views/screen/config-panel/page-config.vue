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
              <el-tooltip effect="blue" content="全屏铺满">
                <el-radio-button :label="ZoomMode.full">
                  <i class="v-icon-fullscreen"></i>
                </el-radio-button>
              </el-tooltip>
              <el-tooltip effect="blue" content="等比缩放宽度铺满">
                <el-radio-button :label="ZoomMode.width">
                  <i class="v-icon-adapt-width"></i>
                </el-radio-button>
              </el-tooltip>
              <el-tooltip effect="blue" content="等比缩放高度铺满">
                <el-radio-button :label="ZoomMode.height">
                  <i class="v-icon-adapt-height"></i>
                </el-radio-button>
              </el-tooltip>
              <el-tooltip effect="blue" content="等比缩放高度铺满（可滚动）">
                <el-radio-button :label="ZoomMode.auto">
                  <i class="v-icon-adapt-auto"></i>
                </el-radio-button>
              </el-tooltip>
              <el-tooltip effect="blue" content="不缩放">
                <el-radio-button :label="ZoomMode.disabled">
                  <i class="v-icon-stop"></i>
                </el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </g-field>
          <g-field label="栅格间距" tooltip="每次移动的距离，单位px">
            <g-input-number v-model="pageConfig.grid" :min="1" :max="20" />
          </g-field>
        </div>

        <div class="page-config-wp">
          <g-field label="缩略图">
            <el-button size="mini" class="cover-btn" @click="cutCover">
              <template v-if="cover.loading">
                <i class="v-icon-loading"></i>
              </template>
              <template v-else>
                截取封面
              </template>
            </el-button>
            <el-upload
              accept="image/*"
              :action="cover.uploadHost"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              :on-error="onError"
              :data="form"
              style="display: inline-block;"
              class="upload-cover-wp"
            >
              <el-button size="mini" class="cover-btn">
                <template v-if="uploadLoading">
                  <i class="v-icon-loading"></i>
                </template>
                <template v-else>
                  上传封面
                </template>
              </el-button>
            </el-upload>
            <div class="screen-preview">
              <img v-if="pageConfig.screenshot" :src="pageConfig.screenshot">
              <img v-else :src="cover.img" style="object-fit: contain; opacity: 0.25; filter: grayscale(1);">
              <input readonly class="screen-preview-paste" @paste="onPaste">
            </div>
            <span class="upload-tip">*选中封面，从剪贴板粘贴</span>
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
import { ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { bgImg, coverImg } from '@/data/images'
import { ZoomMode } from '@/utils/enums/com-enums'
import html2canvas from 'html2canvas'
import { uploadHost, previewHost, validAllowImg, dataURLtoBlob } from '@/utils/upload-util'
import { getTokenByEnv, upload } from '@/api/qiniu'
import { MessageUtil } from '@/utils/message-util'
import { generateId } from '@/utils/util'

export default defineComponent({
  name: 'PageConfig',
  setup() {
    const pageConfig = computed(() => EditorModule.pageConfig)

    const cover = ref({
      loading: false,
      img: coverImg,
      uploadHost,
    })
    const uploadLoading = ref(false)
    const form = ref({
      key: '',
      token: '',
    })

    const resetBGImage = () => {
      pageConfig.value.bgimage = bgImg
    }

    const uploadCover = async (blob: Blob) => {
      try {
        ToolbarModule.addLoading()
        const token = await getTokenByEnv()
        const formData = new FormData()
        formData.append('file', blob)
        formData.append('token', token)
        formData.append('key', `upload/${generateId()}_screenshot.png`)

        const res = await upload(uploadHost, formData)
        if (res) {
          pageConfig.value.screenshot = `${previewHost}/${res.data.key}`
        }
      } catch (error) {
        throw error
      } finally {
        ToolbarModule.removeLoading()
      }
    }

    const cutCover = async () => {
      const dom = document.getElementById('canvas-coms')
      if (!dom || cover.value.loading) {
        return
      }

      const { transform } = dom.style
      dom.style.transform = 'scale(1) translate(0px, 0px)'
      try {
        cover.value.loading = true
        const res = await html2canvas(dom, {
          scale: 1,
          logging: false,
          allowTaint: true,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
        })
        dom.style.transform = transform
        await uploadCover(dataURLtoBlob(res.toDataURL()))
      } catch (error) {
        MessageUtil.error(error.toString())
      } finally {
        cover.value.loading = false
      }
    }

    const beforeUpload = async (file: any) => {
      const valid = validAllowImg(file, {})

      if (!valid) {
        return false
      }

      try {
        ToolbarModule.addLoading()
        uploadLoading.value = true
        form.value.token = await getTokenByEnv()
        form.value.key = `upload/${generateId()}_${file.name}`
        return true
      } catch (error) {
        ToolbarModule.removeLoading()
        uploadLoading.value = false
        MessageUtil.error(error.toString())
      }

      return false
    }

    const onSuccess = (res: any) => {
      ToolbarModule.removeLoading()
      uploadLoading.value = false
      pageConfig.value.screenshot = `${previewHost}/${res.key}`
    }

    const onError = (error: any) => {
      ToolbarModule.removeLoading()
      uploadLoading.value = false
      MessageUtil.error(error.toString())
    }

    const onPaste = async (ev: ClipboardEvent) => {
      if (ev.type === 'paste' && ev.clipboardData) {
        try {
          const item = ev.clipboardData.items[0]
          if (item && item.type.includes('image')) {
            const file = item.getAsFile()
            if (file) {
              await uploadCover(file)
            }
          }
        } catch (error) {
          MessageUtil.error(error.toString())
        }
      }
    }

    return {
      pageConfig,
      ZoomMode,
      cover,
      uploadLoading,
      resetBGImage,
      cutCover,
      form,
      beforeUpload,
      onSuccess,
      onError,
      onPaste,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

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

.cover-btn {
  width: 91px;

  .v-icon-loading {
    font-size: 12px;
  }
}

.upload-cover-wp {
  display: inline-block;

  .cover-btn {
    border-left: 1px solid transparent;
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

.upload-tip {
  color: $input-font-color-description;
  margin-top: 4px;
  display: -webkit-box;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
