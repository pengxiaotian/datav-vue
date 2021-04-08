<template>
  <div class="g-upload">
    <el-input
      :model-value="modelValue"
      placeholder="请输入图片地址"
      prefix-icon="el-icon-link"
      size="mini"
      clearable
      @update:model-value="handleInput"
    />
    <el-upload
      v-loading="loading"
      element-loading-text="正在上传..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      drag
      :action="action"
      :limit="2"
      accept="image/*"
      :multiple="false"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :data="form"
    >
      <img v-if="modelValue && !iserr" :src="modelValue">
      <div v-else class="g-upload-tip">
        <i class="v-icon-img"></i>
        <div>点击或拖拽文件到这里更换</div>
      </div>
    </el-upload>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import { MessageUtil } from '@/utils/message-util'
import { generateShortId } from '@/utils/util'
import { getToken, genUpToken } from '@/api/qiniu'

export default defineComponent({
  name: 'GUploadImage',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    allowType: {
      type: String,
      default: 'gif|jpeg|jpg|png',
    },
    size: {
      type: Number,
      default: 2,
    },
    action: {
      type: String,
      default: process.env.VUE_APP_QINIU_UPLOAD,
    },
    previewHost: {
      type: String,
      default: process.env.VUE_APP_QINIU_FILE,
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const loading = ref(false)
    const form = ref({
      key: '',
      token: '',
    })
    const iserr = ref(false)

    const beforeUpload = async (file: any) => {
      const regx = new RegExp(`\\.(${props.allowType})$`, 'i')
      if (!regx.test(file.name)) {
        MessageUtil.error(`上传图片的格式只能是 ${props.allowType} 中的一种！`)
        return false
      }

      if (file.size / 1024 / 1024 > props.size) {
        MessageUtil.error(`上传图片的大小不能超过 ${props.size}MB！`)
        return false
      }

      try {
        loading.value = true
        let res
        if (process.env.NODE_ENV === 'development') {
          res = genUpToken()
        } else {
          res = await getToken()
        }

        form.value.token = res.data
        form.value.key = `upload/${file.name}_${generateShortId()}`

        loading.value = true
        return true
      } catch (error) {
        loading.value = false
        MessageUtil.error(error.toString())
      }

      return false
    }

    const onSuccess = (res: any) => {
      loading.value = false
      ctx.emit(UPDATE_MODEL_EVENT, `${props.previewHost}/${res.key}`)
    }

    const onError = (error: any) => {
      loading.value = false
      MessageUtil.error(error.toString())
    }

    const handleInput = (value: string) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const zoomImage = () => {
      const img = new Image()
      img.src = props.modelValue
      img.onload = () => {
        iserr.value = false
      }

      img.onerror = () => {
        iserr.value = true
        if (props.modelValue) {
          MessageUtil.error('图片加载失败')
        }
      }
    }

    watch(() => props.modelValue, zoomImage)

    return {
      loading,
      form,
      iserr,
      beforeUpload,
      onSuccess,
      onError,
      handleInput,
    }
  },
})
</script>
