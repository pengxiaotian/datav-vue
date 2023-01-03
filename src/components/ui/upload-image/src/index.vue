<template>
  <div
    class="datav-gui g-upload"
    :class="[
      {
        '--inline --single': !!inline,
      }
    ]"
  >
    <n-input
      :value="modelValue"
      size="small"
      placeholder="请输入图片地址"
      @update:value="handleInput"
    >
      <template #prefix>
        <n-icon>
          <IconLink />
        </n-icon>
      </template>
    </n-input>
    <n-upload
      accept="image/*"
      :action="action"
      :multiple="false"
      :show-file-list="false"
      :data="form"
      @before-upload="beforeUpload"
      @finish="finishUpload"
    >
      <n-upload-dragger>
        <n-spin :show="loading">
          <div
            class="g-upload-image-wrap"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <div class="g-upload-image-content">
              <img v-if="modelValue && !iserr" :src="modelValue">
              <div v-else class="g-upload-tip">
                <n-icon size="60">
                  <IconImg />
                </n-icon>
                <div>点击或拖拽文件到这里更换</div>
              </div>
            </div>
            <div v-if="visibleCover" class="g-upload-image-cover">
              <span>更改</span>
              <p style="padding: 0 10px;">|</p>
              <span @click.stop="removeImage">删除</span>
            </div>
          </div>
        </n-spin>
      </n-upload-dragger>
    </n-upload>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue'
import { useMessage, UploadFileInfo, NInput, NUpload, NIcon, NSpin, NUploadDragger } from 'naive-ui'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import { generateId } from '@/utils/util'
import { uploadHost, previewHost, validAllowImg } from '@/utils/upload-util'
import { getTokenByEnv } from '@/api/qiniu'
import { IconLink, IconImg } from '@/icons'

const props = defineProps({
  modelValue: String,
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
  label: {
    type: String,
    default: '',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
})
const emits = defineEmits([UPDATE_MODEL_EVENT])

const nMessage = useMessage()
const loading = ref(false)
const form = ref({
  key: '',
  token: '',
})
const iserr = ref(false)
const visibleCover = ref(false)

const beforeUpload = async (options: { file: UploadFileInfo; }) => {
  const valid = validAllowImg(options.file.file, {
    allowType: props.allowType,
    allowSize: props.size,
  })

  if (valid) {
    nMessage.error(valid)
    return false
  }

  try {
    loading.value = true
    form.value.token = await getTokenByEnv()
    form.value.key = `upload/${generateId()}_${options.file.name}`
    return true
  } catch (error) {
    loading.value = false
    nMessage.error(error.message)
  }

  return false
}

const finishUpload = (options: { file: UploadFileInfo; event?: ProgressEvent; }) => {
  loading.value = false

  const res = JSON.parse((options.event.target as XMLHttpRequest).response)
  if (res.error) {
    nMessage.error(res.error)
  } else {
    emits(UPDATE_MODEL_EVENT, `${props.previewHost}/${res.key}`)
  }
}

const handleInput = (value: string) => {
  emits(UPDATE_MODEL_EVENT, value)
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
      nMessage.error('图片加载失败')
    }
  }
}

const handleMouseEnter = () => {
  if (props.modelValue) {
    visibleCover.value = true
  }
}

const handleMouseLeave = () => {
  visibleCover.value = false
}

const removeImage = () => {
  handleInput('')
  visibleCover.value = false
}

watch(() => props.modelValue, zoomImage)
</script>
