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
      accept="image/*"
      :action="action"
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
import { generateId } from '@/utils/util'
import { uploadHost, previewHost, validAllowImg } from '@/utils/upload-util'
import { getTokenByEnv } from '@/api/qiniu'

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
      default: uploadHost,
    },
    previewHost: {
      type: String,
      default: previewHost,
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
      const valid = validAllowImg(file, {
        allowType: props.allowType,
        allowSize: props.size,
      })

      if (!valid) {
        return false
      }

      try {
        loading.value = true
        form.value.token = await getTokenByEnv()
        form.value.key = `upload/${generateId()}_${file.name}`
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
