<template>
  <div class="my-screen">
    <div class="screen">
      <div class="screen-info">
        <div class="screen-img" :style="thumbnailStyle"></div>
        <div class="screen-edit">
          <div class="screen-button">
            <router-link
              :to="{
                name: 'ScreenEditor',
                params: { projectId: screen.id },
                query: {
                  tpl: screen.id < 100 ? screen.id : undefined,
                },
              }"
              target="_blank"
              class="edit-wrap"
            >
              <n-button type="primary" :focusable="false" class="edit">
                编辑
              </n-button>
            </router-link>
            <div class="main-button">
              <g-tooltip-popover content="移动">
                <span
                  class="button-span"
                  draggable="true"
                  @dragstart="onDragStart"
                  @dragend="onDragEnd"
                >
                  <n-icon :size="20">
                    <IconMove />
                  </n-icon>
                </span>
              </g-tooltip-popover>
              <g-tooltip-popover content="复制">
                <span class="button-span" @click="confirmCopyProject">
                  <n-icon :size="20">
                    <IconCopy />
                  </n-icon>
                </span>
              </g-tooltip-popover>
              <g-tooltip-popover content="删除">
                <span class="button-span" @click="confirmDeleteProject">
                  <n-icon :size="20">
                    <IconDelete />
                  </n-icon>
                </span>
              </g-tooltip-popover>
            </div>
          </div>

          <router-link
            :to="{
              name: 'Preview',
              params: { screenId: screen.id }
            }"
            target="_blank"
            class="preview"
          >
            <g-tooltip-popover content="预览">
              <n-icon :size="18">
                <IconPreview />
              </n-icon>
            </g-tooltip-popover>
          </router-link>
          <div class="public" @click="doPublish">
            <g-tooltip-popover content="发布">
              <n-icon :size="18">
                <IconRelease />
              </n-icon>
            </g-tooltip-popover>
          </div>
        </div>
      </div>
      <div class="screen-main">
        <div class="main-name">
          <g-tooltip-popover
            placement="top-start"
            :delay="1000"
            :content="screen.name"
          >
            <div class="screen-name-input">
              <n-icon>
                <IconEdit />
              </n-icon>
              <input v-model.trim="screenName" class="input" @blur="onInputBlur">
            </div>
          </g-tooltip-popover>
          <div class="publish-info">
            <span class="dot" :class="{ published: publishState.published }"></span>
            <span>{{ publishState.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { h, defineComponent, PropType, toRefs, computed, ref, inject } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { globalConfig } from '@/config'
import { Project } from '@/domains/project'
import { useProjectStore } from '@/store/project'
import { IconWarning, IconMove, IconCopy, IconDelete, IconEdit, IconPreview, IconRelease } from '@/icons'
import { projectInjectionKey, projectListInjectionKey } from './config'

const cdn = import.meta.env.VITE_APP_CDN

export default defineComponent({
  name: 'MyScreen',
  components: {
    IconMove,
    IconCopy,
    IconDelete,
    IconEdit,
    IconPreview,
    IconRelease,
  },
  props: {
    screen: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  setup(props) {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const projectStore = useProjectStore()
    const { id, name, groupId, share, thumbnail } = toRefs(props.screen)
    const screenName = ref(name.value)
    const oldScreenName = ref(name.value)
    const pConfig = inject(projectInjectionKey)
    const plConfig = inject(projectListInjectionKey)

    const thumbnailStyle = computed(() => {
      if (thumbnail.value) {
        return {
          'background-image': `url(${thumbnail.value})`,
        }
      }
      return {
        'background-image': `url(${globalConfig.logo})`,
        'background-size': '50%',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        filter: 'grayscale(1)',
        opacity: 0.07,
      }
    })

    const publishState = computed(() => {
      const published = !!share.value
      return {
        published,
        text: published ? '已发布' : '未发布',
      }
    })

    const onInputBlur = async () => {
      if (screenName.value) {
        try {
          await projectStore.updateName(id.value, screenName.value)
          name.value = screenName.value
        } catch (error) {
          nMessage.error(error.message)
        }
      } else {
        screenName.value = oldScreenName.value
      }
    }

    const confirmCopyProject = () => {
      projectStore.copy(id.value, groupId.value)
    }

    const confirmDeleteProject = () => {
      const d = nDialog.create({
        content: `${screenName.value} 删除后无法恢复，确认删除？`,
        negativeText: '取消',
        positiveText: '确定',
        iconPlacement: 'top',
        icon: () => h(IconWarning),
        onPositiveClick: async () => {
          d.loading = true
          try {
            await projectStore.delete(id.value, groupId.value)
          } catch (error) {
            nMessage.error(error.message)
          }
        },
      })
    }

    const image = new Image()
    image.src = `${cdn}/datav/drag-thumbnail.png`

    const onDragStart = (event: DragEvent) => {
      pConfig.dragStart()

      const dt = event.dataTransfer
      if (dt) {
        dt.effectAllowed = 'move'
        dt.setDragImage(image, 30, 30)
        dt.setData('text', `${id.value},${groupId.value}`)
      }
    }

    const onDragEnd = () => {
      pConfig.dragEnd()
    }

    const doPublish = () => {
      plConfig.publish(id.value)
    }

    return {
      name,
      thumbnailStyle,
      publishState,
      screenName,
      oldScreenName,
      onInputBlur,
      confirmCopyProject,
      confirmDeleteProject,
      onDragStart,
      onDragEnd,
      doPublish,
    }
  },
})
</script>

<style lang="scss" scoped>
.my-screen {
  margin: 16px 32px 16px 0;
}

.screen {
  display: flex;
  flex-direction: column;
  width: 258px;
  height: 184px;
  border: 1px solid var(--datav-border-color);
  transition: 0.2s;

  .screen-info {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .screen-img {
      width: inherit;
      height: 146px;
      background-size: 100% 100%;
      opacity: 0.6;
    }

    .screen-edit {
      position: absolute;
      opacity: 0;
      display: flex;
      width: 100%;
      height: 100%;
      pointer-events: none;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
      background: rgb(0 0 0 / 80%);

      .edit-wrap {
        .edit {
          min-width: 116px;
          padding: 0 30px;
          font-size: 16px;
        }
      }

      .main-button {
        display: flex;
        justify-content: space-around;
        font-size: 19px;
        padding-top: 15px;
        align-items: center;
        color: #fff;
      }

      .screen-button {
        text-align: center;

        .button-span {
          padding: 0 10px;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: var(--datav-main-hover-color);
          }
        }
      }

      .preview {
        position: absolute;
        top: 10px;
        right: 35px;
      }

      .public {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #fff;
        cursor: pointer;
        transition: color 0.2s;
      }

      .preview,
      .public {
        color: #fff;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: var(--datav-main-hover-color);
        }
      }
    }
  }

  &:hover {
    box-shadow: var(--datav-shadow);
    border: var(--datav-border-primary);

    .screen-info {
      .screen-edit {
        opacity: 1;
        pointer-events: all;
      }
    }
  }

  .screen-main {
    .main-name {
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;
      position: relative;
      justify-content: space-between;
      color: #fff;
      background: var(--datav-bgcolor-2);
      padding: 0 10px;

      .screen-name-input {
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        flex: 1;

        .input {
          width: 120px;
          color: var(--datav-font-color);
          background: 0 0;
          padding: 0 5px;
          line-height: 28px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          border: 1px solid transparent;

          &:hover {
            color: #fff;
          }

          &:focus {
            background: var(--datav-bgcolor-2);
          }
        }
      }

      .publish-info {
        align-items: center;
        display: flex;
        color: var(--datav-font-color);

        .dot {
          content: "";
          margin-right: 5px;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 5px;
          background-color: #576369;

          &.published {
            background-color: var(--datav-main-color);
          }
        }
      }
    }
  }
}
</style>
