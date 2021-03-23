<template>
  <div class="my-screen">
    <div class="screen">
      <div class="screen-info">
        <div class="screen-img" :style="thumbnail"></div>
        <div class="screen-edit">
          <div class="screen-button">
            <router-link
              to="/"
              target="_blank"
              class="edit-wrap"
            >
              <el-button type="primary" size="small" class="edit">
                编辑
              </el-button>
            </router-link>
            <div class="main-button">
              <g-tooltip-popover content="移动">
                <span class="button-span" draggable="true" @dragstart="onDragStart">
                  <i class="v-icon-move"></i>
                </span>
              </g-tooltip-popover>
              <g-tooltip-popover content="复制">
                <span class="button-span" @click="confirmCopyProject">
                  <i class="v-icon-copy"></i>
                </span>
              </g-tooltip-popover>
              <g-tooltip-popover content="删除">
                <span class="button-span" @click="confirmDeleteProject">
                  <i class="v-icon-delete"></i>
                </span>
              </g-tooltip-popover>
            </div>
          </div>

          <router-link
            to="/"
            target="_blank"
            class="preview"
          >
            <g-tooltip-popover content="预览">
              <i class="v-icon-preview"></i>
            </g-tooltip-popover>
          </router-link>
          <div class="public">
            <g-tooltip-popover content="发布">
              <i class="v-icon-release"></i>
            </g-tooltip-popover>
          </div>
        </div>
      </div>
      <div class="screen-main">
        <div class="main-name">
          <g-tooltip-popover
            placement="top-start"
            :show-after="1000"
            :content="screen.name"
          >
            <div class="screen-name-input">
              <i class="v-icon-edit"></i>
              <input v-model.trim="screenName" class="input" @blur="onBlur">
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
import {
  defineComponent, PropType, toRefs,
  computed, ref, watch, inject,
} from 'vue'
import { MessageUtil, MessageBoxUtil } from '@/utils/message-util'
import { Project } from '@/domains/project'
import { coverImg, dragImg } from '@/data/images'
import { updateProjectName } from '@/api/project'

export default defineComponent({
  name: 'MyScreen',
  props: {
    screen: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  setup(props) {
    const { id, name, groupId, share, config } = toRefs(props.screen)
    const screenName = ref(name.value)
    const oldScreenName = ref(name.value)

    const thumbnail = computed(() => {
      if (config.value.screenshot) {
        return {
          'background-image': `url(${config.value.screenshot})`,
        }
      }
      return {
        'background-image': `url(${coverImg})`,
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

    const onBlur = () => {
      if (screenName.value) {
        updateProjectName(id.value, screenName.value)
          .catch(error => {
            MessageUtil.error(MessageUtil.format(error))
          })
      } else {
        screenName.value = oldScreenName.value
      }
    }

    watch(screenName, nv => {
      name.value = nv
    })

    const deleteProject = inject('deleteProject') as Function
    const copyProject = inject('copyProject') as Function

    const confirmCopyProject = () => {
      copyProject(groupId.value, id.value)
    }

    const confirmDeleteProject = () => {
      MessageBoxUtil.confirmAsync(
        `${screenName.value} 删除后无法恢复，确认删除？`,
        () => deleteProject(groupId.value, id.value))
    }

    const onDragStart = (event: DragEvent) => {
      const dt = event.dataTransfer
      if (dt) {
        dt.setData('text', `${id.value},${groupId.value}`)

        const img = new Image()
        img.src = dragImg
        dt.setDragImage(img, 10, 10)
      }
    }

    return {
      name,
      thumbnail,
      publishState,
      screenName,
      oldScreenName,
      onBlur,
      confirmCopyProject,
      confirmDeleteProject,
      onDragStart,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.my-screen {
  margin: 16px 32px 16px 0;
}

.screen {
  display: flex;
  flex-direction: column;
  width: 258px;
  height: 184px;
  border: 1px solid $screen-border-color;
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
      background: $screen-bgcolor;

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
        color: $icon-color;
      }

      .screen-button {
        text-align: center;

        .button-span {
          padding: 0 10px;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: $icon-hover-color;
          }

          [class^="v-icon-"] {
            font-size: 16px;
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
        color: $icon-color;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: $icon-hover-color;
        }
      }
    }
  }

  &:hover {
    box-shadow: 0 0 10px -2px $screen-shadow-color;
    border: 1px solid $color-primary;

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
      color: $screen-font-color;
      background: $input-bgcolor;
      padding: 0 10px;

      .screen-name-input {
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        flex: 1;

        .input {
          width: 120px;
          color: $input-hover-color;
          background: 0 0;
          padding: 0 5px;
          line-height: 28px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          border: 1px solid transparent;

          &:hover {
            color: $input-color;
          }

          &:focus {
            background: $input-bgcolor;
          }
        }
      }

      .publish-info {
        align-items: center;
        display: flex;
        color: $publish-font-color;

        .dot {
          content: "";
          margin-right: 5px;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 5px;
          background-color: $publish-dot-color;

          &.published {
            background-color: $color-primary;
          }
        }
      }
    }
  }
}
</style>
