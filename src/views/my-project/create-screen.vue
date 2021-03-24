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
              <el-button type="primary" icon="el-icon-plus">
                创建项目
              </el-button>
            </div>
            <div class="template-info">
              空白画板
            </div>
          </div>
          <div v-for="tpl in templates" :key="tpl.id" class="template-item">
            <div class="template-image">
              <img :src="tpl.thumbnail" alt="" class="preview-image">
              <div class="template-mask">
                <el-button type="primary" class="create-btn">
                  创建项目
                </el-button>
                <el-button class="preview-btn">
                  预览
                </el-button>
              </div>
            </div>
            <div class="template-info">
              <div class="template-name">{{ tpl.name }}</div>
              <div class="template-size">
                <p v-for="(s, idx) in tpl.size" :key="idx">{{ s }}</p>
              </div>
            </div>
          </div>
          <div v-for="i in 3" :key="i" class="template-item-placehoder"></div>
        </div>
      </div>
    </div>
  </g-loading>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue'
import { coverImg } from '@/data/images'
import { getProjectTemplate } from '@/api/project'

interface ProjectTemplate {
  id: number
  name: string
  size: String[]
  snapshot: string
  thumbnail: string
}

export default defineComponent({
  name: 'CreateScreen',
  setup() {
    const loading = ref(true)
    const bgCoverImg = ref(coverImg)
    const templates = ref<ProjectTemplate[]>([])

    onMounted(async () => {
      const res = await getProjectTemplate()
      if (res.data.code === 0) {
        loading.value = false
        templates.value = res.data.data
      }
    })

    return {
      loading,
      bgCoverImg,
      templates,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

@font-face {
  font-family: "Orbitron-Bold";
  src: url('../../styles/fonts/orbitron-bold.ttf') format('truetype'),
    url('../../styles/fonts/orbitron-bold.otf') format('opentype');
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
      border-top: 1px solid $color-primary;
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
      border-bottom: 1px solid $color-primary;
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
      box-shadow: 0 0 10px -6px #000;
      border: 1px solid #3a4659;
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
        background: #1d262e;
        transition: 0.2s;
      }

      &.--blank {
        position: relative;
        outline: 1px solid $color-primary;

        .template-image {
          box-shadow: inset 0 0 46px 0 rgba(136, 215, 255, 0.29);
        }

        .template-info {
          border-top: 1px solid $color-primary;
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
      outline: 1px solid $color-primary;

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
</style>
