<template>
  <div>
    <div class="datav-hearder" :style="{ background: isFixed ? '#171b22' : '' }">
      <div class="logo">
        <div class="top-tip">
          <strong class="tip-strong">公告</strong>
          <div class="datav-marquee">
            <span class="content">
              <template v-for="n in 2" :key="n">
                1. DataV 仅支持谷歌 Chrome 浏览器版本 60 以上。2. DataV 基于 Vue 3.x 开发。3. 项目地址：<a href="https://github.com/pengxiaotian/datav-vue" target="_blank" class="project-href">https://github.com/pengxiaotian/datav-vue</a>
                <span class="content-space"></span>
              </template>
            </span>
          </div>
        </div>
      </div>
      <div class="user">
        <div class="header-item">
          <g-drop-list-popover>
            <span class="user-link-wrap">
              <el-avatar :size="20" :src="avatar + '?imageView2/1/w/80/h/80'">
                <img src="/images/avatar-placeholder.png">
              </el-avatar>
              <span class="user-link">
                {{ userName }} <i class="el-icon-caret-bottom"></i>
              </span>
            </span>
            <template #droplist>
              <g-drop-list>
                <g-drop-list-item icon="v-icon-logout" @click="logout">
                  退出
                </g-drop-list-item>
              </g-drop-list>
            </template>
          </g-drop-list-popover>
        </div>
      </div>
    </div>
    <div class="datav-nav">
      <div class="header-img">
        <img class="nav-img-text" :src="`${cdn}/datav/nav-img-text.png`">
        <div class="nav-img"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UserStore } from '@/domains/user'
import { useRouter } from 'vue-router'

const cdn = import.meta.env.VITE_APP_CDN

export default defineComponent({
  name: 'NavHeader',
  props: {
    isFixed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { name, avatar, doLogout } = UserStore()
    const router = useRouter()

    const logout = () => {
      doLogout().then(() => {
        router.push({ name: 'Login' })
      })
    }

    return {
      cdn,
      userName: name,
      avatar,
      logout,
    }
  },
})
</script>

<style lang="scss">
@import '@/styles/themes/var';
@import '@/styles/mixins/function';

.datav-hearder {
  display: flex;
  position: fixed;
  top: 0;
  justify-content: space-between;
  z-index: 999;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  background-image: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0) 19%,
    #171717 100%
  );

  .logo {
    display: flex;
    flex: 1;
    align-items: center;
    padding-left: 18px;
  }

  .user {
    display: flex;
    justify-content: flex-end;
    padding-right: 15px;
    align-items: center;
    font-size: 14px;
    z-index: 9;
    min-width: 540px;

    .header-item {
      margin: 0 5px;
      padding: 0 10px;
      cursor: pointer;
      user-select: none;
      color: $font-color;
      line-height: 20px;
      height: 20px;
    }

    .user-link-wrap {
      display: flex;
      align-items: center;
    }

    .user-link {
      line-height: 20px;
      height: 20px;
      margin-left: 5px;
      color: $font-color;
    }
  }
}

.top-tip {
  padding: 6px 0;
  font-size: $header-font-size;
  color: $font-color;
  display: flex;
  right: 0;
  height: 30px;
  margin-right: 24px;
  width: 600px;

  .tip-strong {
    white-space: nowrap;
    padding-right: 8px;
  }
}

.datav-marquee {
  display: block;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: clip;
  position: relative;

  .content {
    display: inline-block;
    position: relative;
    padding-right: 0;
    white-space: nowrap;
    animation: marque-animation 20s infinite linear;
    z-index: 0;

    &:hover {
      animation-play-state: paused;
    }
  }

  .content-space {
    display: inline-block;
    width: 5em;
  }

  .project-href {
    color: $font-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes marque-animation {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.datav-nav {
  display: flex;
  position: absolute;
  top: 0;
  flex-direction: column;
  background: $background-color;
  width: 100%;
  height: 290px;

  .header-img {
    opacity: 1;
    z-index: 1;
  }

  .nav-img-text {
    z-index: 1;
    transform-origin: 0 0;
    transform: scale(0.5);
    top: 80px;
    left: 40px;
    position: absolute;
    user-select: none;
    cursor: pointer;
  }

  .nav-img {
    position: absolute;
    width: 100%;
    height: 290px;
    background-size: cover;
    background-position: center;
    background-image: url(com-cdn('datav/nav-img.png'));
  }
}
</style>
