<template>
  <n-modal
    v-model:show="visible"
    preset="dialog"
    :show-icon="false"
    title="发布"
    style="width: 435px;"
    @close="closeDialog"
  >
    <n-spin :show="loading" class="share-setting">
      <div class="share-header">
        <div class="header-wp">
          <label class="label-color">发布分享：</label>
          <div class="share-switch">
            <n-switch v-model:value="isPublish" />
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
          <n-tooltip
            :show="showTooltip"
            trigger="manual"
            :disabled="!isPublish"
          >
            <template #trigger>
              <textarea
                :value="shareUrl"
                class="new-input share-input"
                readonly
                placeholder="开启发布分享后可获取访问链接"
                @click="copyUrl"
                @mouseenter="showTooltip = true"
                @mouseleave="showTooltip = false"
              ></textarea>
            </template>
            点击复制
          </n-tooltip>
          <div class="func-btn" @click="copyUrl">复制</div>
        </div>
        <div class="label-color">访问密码</div>
        <div class="share-pwd">
          <new-input
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
        <n-button
          type="primary"
          :focusable="false"
          class="publish-btn"
          @click="publish"
        >
          {{ isPublish ? '发布大屏' : '保存' }}
        </n-button>
      </div>
    </n-spin>
  </n-modal>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import { useMessage } from 'naive-ui'
import { getShareUrl, getPublishInfo, publishApp } from '@/api/project'
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
    const nMessage = useMessage()
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
          copyText(shareUrl.value).then(() => {
            nMessage.success('复制成功')
          })
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
        nMessage.error('读取大屏发布信息失败')
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
          nMessage.success(isPublish.value ? '发布成功' : '保存成功')
        }
      } catch (error) {
        nMessage.error('发布失败')
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
.share-setting {
  user-select: text;

  .share-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    font-size: 14px;
    border-bottom: 1px solid var(--datav-border-color);
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
    padding: 10px 0;
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
    color: var(--datav-main-color);
    text-decoration: none;
  }

  .share-verify {
    .label-color {
      padding-top: 16px;
    }
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
    background: var(--datav-bgcolor-2);
    cursor: pointer;
    resize: none;
  }

  .pwd-input {
    width: 80%;
    height: 25px;
    line-height: 25px;
    background: var(--datav-bgcolor-2);
    cursor: text;
  }

  .func-btn {
    color: var(--datav-main-color);
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
