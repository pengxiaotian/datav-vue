<template>
  <g-loading type="square" :spinning="loading">
    <div class="create-screen">
      <div class="top-bar">
        <div class="right-bar"></div>
        <div class="left-bar"></div>
        <router-link to="/" class="return-btn">
          <span class="return-text">
            <i class="v-icon-back return-icon"></i>
            取消创建
          </span>
        </router-link>
      </div>
      <div class="creator-wp">
        <div class="template-list">
          <div class="template-item --blank">
            <div class="template-image">
              <el-button type="primary" icon="el-icon-plus" @click="confirmCreate(null)">
                创建项目
              </el-button>
            </div>
            <div class="template-info">
              空白画板
            </div>
          </div>
          <div v-for="(tpl, idx) in templates" :key="tpl.id" class="template-item">
            <div class="template-image">
              <img :src="tpl.thumbnail" alt="" class="preview-image">
              <div class="template-mask">
                <el-button type="primary" class="create-btn" @click="confirmCreate(tpl)">
                  创建项目
                </el-button>
                <el-button class="preview-btn" @click="previewTemplate(tpl, idx)">
                  预览
                </el-button>
              </div>
            </div>
            <div class="template-info">
              <div class="template-name">{{ tpl.name }}</div>
              <div class="template-size">
                <p v-for="(s, i) in tpl.size" :key="i">{{ s }}</p>
              </div>
            </div>
          </div>
          <div v-for="i in 3" :key="i" class="template-item-placehoder"></div>
        </div>
      </div>
    </div>
  </g-loading>

  <el-dialog v-model="visibleCreateDialog" title="创建数据大屏" width="400px">
    <div class="create-dialog">
      <p class="name-title">
        <span class="required">*</span>数据大屏名称
      </p>
      <g-input
        v-model="projectName"
        placeholder="请输入大屏名称"
        spellcheck="false"
        class="name-input"
      />
      <p class="name-title">大屏分组</p>
      <el-select v-model="groupId" size="mini" placeholder="请选择">
        <el-option
          v-for="item in groups"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <template #footer>
      <el-button @click="visibleCreateDialog = false">取消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="doCreate">
        创建
      </el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="visiblePreviewDialog" title="预览" width="897px">
    <div class="preview-dialog">
      <div class="preview-list">
        <p class="template-list-title">模板列表</p>
        <div class="blur-wp">
          <div ref="scrollRef" class="scroll-wp">
            <div
              v-for="(tpl, idx) in templates"
              :key="tpl.id"
              class="preview-wp"
              :class="{ selected: tpl.id === template.id }"
              @click="togglePreviewTemplate(tpl, idx)"
            >
              <img :src="tpl.thumbnail" class="preview-small-img">
              <div class="preview-screen-name">{{ tpl.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="preview-gif">
        <div class="gif-wp">
          <img class="snapshot-gif" :src="template.snapshot">
          <i class="el-icon-arrow-left prev-icon" @click="prevPreviewTemplate"></i>
          <i class="el-icon-arrow-right next-icon" @click="nextPreviewTemplate"></i>
        </div>
        <div class="preview-create">
          <div class="create-dialog">
            <p class="name-title">
              <span class="required">*</span>数据大屏名称
            </p>
            <g-input
              v-model="projectName"
              placeholder="请输入大屏名称"
              spellcheck="false"
              class="name-input"
            />
            <p class="name-title">大屏分组</p>
            <el-select v-model="groupId" size="mini" placeholder="请选择">
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <el-button
            type="primary"
            size="mini"
            :loading="saveLoading"
            style="margin-top: 30px;"
            @click="doCreate"
          >
            创建大屏 <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { coverImg } from '@/data/images'
import { ProjectGroup, ProjectTemplate } from '@/domains/project'
import { getProjectTemplate, getProjects, createProject } from '@/api/project'
import { MessageUtil } from '@/utils/message-util'
import { scrollToLeft } from '@/utils/animation'

export default defineComponent({
  name: 'CreateScreen',
  setup() {
    const loading = ref(true)
    const bgCoverImg = ref(coverImg)
    const templates = ref<ProjectTemplate[]>([])

    const visibleCreateDialog = ref(false)
    const visiblePreviewDialog = ref(false)
    const projectName = ref('')
    const template = ref<Partial<ProjectTemplate> | null>({})
    const groupId = ref(0)
    const groups = ref([new ProjectGroup(0, '未分组')])
    const saveLoading = ref(false)
    const router = useRouter()
    const scrollRef = ref<any>(null)

    onMounted(async () => {
      const res = await getProjectTemplate()
      if (res.data.code === 0) {
        loading.value = false
        templates.value = res.data.data
      }

      getProjects()
        .then(({ data }) => {
          if (data.code === 0) {
            groups.value.push(...data.data.map(({ id, name }: any) => ({ id, name })))
          }
        })
    })

    const confirmCreate = (tpl: ProjectTemplate | null) => {
      template.value = tpl
      visibleCreateDialog.value = true
    }

    const previewTemplate = (tpl: ProjectTemplate, idx: number) => {
      template.value = tpl
      visiblePreviewDialog.value = true

      nextTick(() => {
        togglePreviewTemplate(tpl, idx)
      })
    }

    const togglePreviewTemplate = (tpl: ProjectTemplate, idx: number) => {
      template.value = tpl
      scrollToLeft(149 * idx - 350, {
        getContainer: () => scrollRef.value,
      })
    }

    const prevPreviewTemplate = () => {
      const idx = templates.value.findIndex(m => m.id === template.value.id)
      if (idx > 0) {
        const nidx = idx - 1
        const tpl = templates.value[nidx]
        togglePreviewTemplate(tpl, nidx)
      }
    }

    const nextPreviewTemplate = () => {
      const idx = templates.value.findIndex(m => m.id === template.value.id)
      if (idx < templates.value.length - 1) {
        const nidx = idx + 1
        const tpl = templates.value[nidx]
        togglePreviewTemplate(tpl, nidx)
      }
    }

    const doCreate = async () => {
      try {
        if (!projectName.value) {
          MessageUtil.error('请输入大屏名称')
          return
        }
        saveLoading.value = true
        const res = await createProject({
          name: projectName.value,
          groupId: groupId.value,
          templateId: template.value?.id ?? 0,
        })
        if (res.data.code === 0) {
          visibleCreateDialog.value = false
          visiblePreviewDialog.value = false
          router.push({ name: 'ScreenEditor', params: { projectId: res.data.data } })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        MessageUtil.error(MessageUtil.format(error))
      } finally {
        saveLoading.value = false
      }
    }

    return {
      loading,
      bgCoverImg,
      templates,
      visibleCreateDialog,
      visiblePreviewDialog,
      projectName,
      template,
      groupId,
      groups,
      saveLoading,
      scrollRef,
      confirmCreate,
      previewTemplate,
      togglePreviewTemplate,
      prevPreviewTemplate,
      nextPreviewTemplate,
      doCreate,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

@font-face {
  font-family: "Orbitron-Bold";
  src: url('../../styles/fonts/orbitron-bold.ttf') format('truetype');
}

@mixin cover-img {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #131e2d;
  background-image: url(//files.pengxiaotian.com/datav/datav-vue-logo.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
  filter: grayscale(1);
  opacity: 0.36;
}

.create-screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 51, 125, 0.07);
  margin: 0;
  padding: 0;
  user-select: none;

  .top-bar {
    height: 50px;
    width: 100%;
    position: relative;

    &::before {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      width: 100%;
      background: #151b22;
    }

    .right-bar {
      position: absolute;
      left: 150px;
      top: 20px;
      height: 5px;
      width: 100%;
      border-top: $border-primary;
      border-left: 2px solid $color-primary;
      background: rgba(55, 126, 255, 0.04);
      border-top-left-radius: 5px;
      transform: skewX(-45deg);
      box-shadow: 0 5px 28px 0 rgba(55, 126, 255, 0.28);
    }

    .left-bar {
      position: absolute;
      left: 0;
      top: 24px;
      height: 25px;
      width: 138px;
      border-right: 2px solid $color-primary;
      border-bottom: $border-primary;
      transform: skewX(-45deg);
      border-bottom-right-radius: 5px;
      box-shadow: 0 5px 28px 0 rgba(55, 126, 255, 0.28);
    }

    .return-btn {
      position: absolute;
      left: -31px;
      top: 0;
      width: 180px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: #151b22;
      cursor: pointer;
      transform: skewX(-45deg);
      border-bottom-right-radius: 5px;

      .return-text {
        display: inline-block;
        color: #fff;
        font-size: 14px;
        margin-left: 10px;
        transform: skewX(45deg);
        transition: 0.2s;

        &:hover {
          color: $color-primary;
        }
      }

      .return-icon {
        margin-right: 5px;
      }
    }
  }

  .creator-wp {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30px;

    .template-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      overflow-x: hidden;
      overflow-y: scroll;
      color: #fff;
      font-size: 12px;
      margin: 0 -16px;
      padding-bottom: 100px;
      padding-top: 60px;

      .template-item {
        width: 258px;
        height: 184px;
        box-shadow: $shadow;
        border: $border;
        margin: 16px;
        transition: 0.2s;
        outline: 1px solid transparent;
        cursor: default;

        .template-image {
          width: 100%;
          height: 146px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
          position: relative;
        }

        .template-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          height: 36px;
          background: $background-color-dark;
          transition: 0.2s;
        }

        &.--blank {
          position: relative;
          outline: $border-primary;

          .template-image {
            box-shadow: inset 0 0 46px 0 rgba(136, 215, 255, 0.29);
          }

          .template-info {
            border-top: $border-primary;
            justify-content: center;
            font-size: 14px;
          }
        }
      }

      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: relative;

        &::after {
          @include cover-img;
        }
      }

      .template-mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        transition: 0.2s;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        opacity: 0;
        font-weight: 400;

        .create-btn {
          width: 112px;
          padding: 0 5px;
        }

        .preview-btn {
          margin-top: 10px;
          width: 112px;
          padding: 0 5px;
          margin-left: 0;
        }
      }

      .template-item:hover {
        outline: $border-primary;

        .template-mask {
          pointer-events: all;
          opacity: 1;
        }
      }

      .template-name {
        font-size: 12px;
      }

      .template-size {
        color: #999;
        text-align: right;
        font-family: Orbitron-Bold, PingFangSC-Medium, PingFang SC, Microsoft YaHei, Arial, Helvetica, sans-serif;
      }

      .template-item-placehoder {
        width: 258px;
        margin: 16px;
      }
    }
  }
}

.create-dialog {
  .required {
    display: inline-block;
    margin-right: 6px;
    color: $color-red;
  }

  .name-title {
    margin-bottom: 10px;
  }

  .name-input {
    margin-bottom: 15px;
    height: 28px;
    line-height: 26px;
  }
}

@mixin slider-blur($placement: left, $angle: -90deg) {
  content: ' ';
  position: absolute;
  top: 0;
  #{$placement}: 0;
  background-image: linear-gradient(
    #{$angle},
    rgba(0, 0, 0, 0) 64%,
    #303640 100%
  );
  width: 82px;
  height: 96px;
  pointer-events: none;
  z-index: 1;
}

.preview-dialog {
  .preview-list {
    width: 897px;
    height: 186px;
    margin-top: -57px;
    margin-left: -20px;
    background: $dialog-bgcolor;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .template-list-title {
      font-size: 12px;
      margin: 50px 0 15px 30px;
    }
  }

  .blur-wp {
    position: relative;
    margin: 0 24px;

    &::before {
      @include slider-blur();
    }

    &::after {
      @include slider-blur(right, 90deg);
    }
  }

  .scroll-wp {
    white-space: nowrap;
    overflow-x: scroll;
    padding-bottom: 8px;

    &::-webkit-scrollbar-thumb {
      background: $color-primary;
      border-radius: 5px;
      border: none;
    }
  }

  .preview-wp {
    position: relative;
    font-size: 0;
    width: 137px;
    height: 97px;
    overflow: hidden;
    display: inline-block;
    margin: 0 6px;
    cursor: pointer;
    border: 1px solid rgba(123, 123, 123, 0.25);
    transition: 0.2s;

    .preview-small-img {
      display: block;
      width: 100%;
      height: 76px;
      object-fit: cover;
      position: relative;

      &::after {
        @include cover-img;
      }
    }

    .preview-screen-name {
      font-size: 12px;
      line-height: 19px;
      background: $background-color-dark;
      padding: 0 5px;
      font-weight: 300;
    }

    &:hover,
    &.selected {
      border-color: $color-primary;
    }
  }

  .preview-gif {
    height: 420px;
    display: flex;
    padding: 30px 10px 50px 10px;

    .gif-wp {
      width: 610px;
      position: relative;

      .snapshot-gif {
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        border: $border;
        box-shadow: $shadow;

        &::after {
          @include cover-img();
        }
      }

      .next-icon,
      .prev-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        padding: 5px;
        border-radius: 50%;
        margin: 10px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.3);
        }
      }

      .next-icon {
        right: 0;
      }
    }

    .preview-create {
      flex: 1;
      overflow: hidden;
      padding-left: 20px;
    }
  }
}
</style>
