<template>
  <el-dialog
    v-model="visible"
    title="发布"
    width="435px"
    @close="closeDialog"
  >
    <div
      v-loading="loading"
      class="share-setting"
      element-loading-background="rgba(48, 54, 64, 0.8)"
    >
      <div class="share-header">
        <div class="header-wp">
          <label class="label-color">发布分享：</label>
          <div class="share-switch">
            <el-switch
              v-model="isPublish"
            />
          </div>
        </div>
        <div class="share-tutorial">
          <router-link
            :to="{ name: 'MyCase' }"
            class="share-tutorial-url"
            target="_blank"
          >
            查看教程
          </router-link>
        </div>
      </div>
      <div class="share-verify">
        <div class="label-color">分享链接</div>
        <div class="link-content">
          <el-tooltip
            v-model="showTooltip"
            effect="blue"
            placement="top"
            content="点击复制"
            :manual="true"
            :disabled="!isPublish"
          >
            <textarea
              :value="shareUrl"
              class="g-input share-input"
              readonly
              placeholder="开启发布分享后可获取访问链接"
              @click="copyUrl"
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
            ></textarea>
          </el-tooltip>
          <div class="func-btn" @click="copyUrl">复制</div>
        </div>
        <div class="label-color">访问密码</div>
        <div class="share-pwd">
          <g-input
            v-model="password"
            :type="passwordType"
            placeholder="设置访问密码"
            class="pwd-input"
          />
          <div
            class="func-btn"
            @click="passwordType ? passwordType = '' : passwordType = 'password'"
          >
            {{ passwordType ? '查看' : '隐藏' }}
          </div>
          <div class="func-btn" @click="password = ''">
            清空
          </div>
        </div>
      </div>
      <div class="initial-dialog">
        <el-button type="primary" class="publish-btn" @click="publish">
          {{ isPublish ? '发布大屏' : '保存' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import { getShareUrl, getPublishInfo, publishApp } from '@/api/project'
import { MessageUtil } from '@/utils/message-util'
import { copyText } from '@/utils/util'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'PublishScreen',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const visible = ref(false)
    const isPublish = ref(false)
    const showTooltip = ref(false)
    const password = ref('')
    const passwordType = ref('password')
    const loading = ref(true)

    const shareUrl = computed(() => {
      return isPublish.value ? getShareUrl(props.projectId) : ''
    })

    const copyUrl = () => {
      if (isPublish.value) {
        nextTick(() => {
          if (copyText(shareUrl.value)) {
            MessageUtil.success('复制成功')
          }
        })
      }
    }

    const closeDialog = () => {
      visible.value = false
      ctx.emit(UPDATE_MODEL_EVENT, false)
    }

    watch(() => props.modelValue, val => {
      if (val) {
        visible.value = true
      } else {
        visible.value = false
      }
    })

    watch(() => props.projectId, async () => {
      try {
        const res = await getPublishInfo(props.projectId)
        if (res.data.code === 0) {
          const { data } = res.data
          loading.value = false
          isPublish.value = !!data.share
          password.value = data.password
        }
      } catch (error) {
        console.log(error)
      }
    })

    const publish = async () => {
      try {
        loading.value = true
        const data = {
          share: shareUrl.value,
          password: password.value,
        }
        const res = await publishApp(props.projectId, data)
        if (res.data.code === 0) {
          loading.value = false
          closeDialog()
          MessageUtil.success(isPublish.value ? '发布成功' : '保存成功')
        }
      } catch (error) {
        MessageUtil.error('发布失败')
      } finally {
        loading.value = false
      }
    }

    return {
      visible,
      isPublish,
      shareUrl,
      showTooltip,
      password,
      copyUrl,
      closeDialog,
      loading,
      passwordType,
      publish,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.share-setting {
  user-select: text;

  .share-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    font-size: 14px;
    border-bottom: 1px solid $border-color;
  }

  .header-wp {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .label-color {
    font-size: 14px;
    letter-spacing: 1.09px;
    color: #fff;
    white-space: nowrap;
    padding: 16px 0 10px;
  }

  .share-switch {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .share-tutorial-url {
    line-height: 28px;
    letter-spacing: 1.09px;
    color: $color-primary;
    text-decoration: none;
  }

  .link-content,
  .share-pwd {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .share-input {
    width: 80%;
    height: 50px;
    line-height: 22px;
    background: $background-dark-color;
    cursor: pointer;
    resize: none;
  }

  .pwd-input {
    width: 80%;
    height: 25px;
    line-height: 25px;
    background: $background-dark-color;
    cursor: text;
  }

  .func-btn {
    color: $color-primary;
    cursor: pointer;
    margin-left: 10px;
  }
}

.initial-dialog {
  width: 368px;
  margin: 22px auto 8px;
  text-align: center;

  .publish-btn {
    width: 80%;
  }
}
</style>
