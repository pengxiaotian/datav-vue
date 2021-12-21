<template>
  <div class="live2d-wrap">
    <div class="live2d-cover" :style="{ transform: `translateY(${cover ? '-20%' : '-80%'})` }">
      <!-- <div class="live2d-cover-text">
        <span>DATAV</span>
      </div> -->
      <div class="live2d-cover-line"></div>
      <div class="live2d-cover-handle" @click="cover = !cover"></div>
    </div>
    <canvas id="live2d" width="500" height="500"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import '@/assets/live2d/live2d.min.js'

/*

https://github.com/pengxiaotian/live2d_api

/add/ - 检测 新增皮肤 并更新 缓存列表
/get/?id=1-23 获取 分组 1 的 第 23 号 皮肤
/rand/?id=1 根据 上一分组 随机切换
/switch/?id=1 根据 上一分组 顺序切换
/rand_textures/?id=1-23 根据 上一皮肤 随机切换 同分组其他皮肤
/switch_textures/?id=1-23 根据 上一皮肤 顺序切换 同分组其他皮肤

*/

const apiPath = 'https://live2d.fghrsh.net/api'

export default defineComponent({
  name: 'Live2d',
  setup() {
    const cover = ref(true)

    const loadModel = (modelId, modelTexturesId) => {
      // @ts-ignore
      loadlive2d('live2d', `${apiPath}/get/?id=${modelId}-${modelTexturesId}`)

      setTimeout(() => {
        cover.value = false
      }, 2000)
    }

    const loadRandModel = () => {
      cover.value = true

      fetch(`${apiPath}/rand/?id=7`)
        .then(response => response.json())
        .then(({ model }) => {
          fetch(`${apiPath}/rand_textures/?id=${model.id}-1`)
            .then(response => response.json())
            .then(({ textures }) => {
              loadModel(model.id, textures.id)
            })
        })
    }

    const initPassword = () => {
      const pwd = document.querySelector('input[type=password]')
      if (pwd) {
        pwd.addEventListener('focus', () => {
          cover.value = true
        })
        pwd.addEventListener('blur', () => {
          cover.value = false
        })
      }
    }

    onMounted(() => {
      // loadModel(1, 86)
      loadRandModel()
      initPassword()
    })

    return {
      cover,
    }
  },
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixins/function.scss";

.live2d-wrap {
  position: relative;
  clip-path: circle(120px at center);

  .live2d-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    transform: translateY(-20%);
    transition: all 0.5s ease-in-out;
    background-image: url(com-cdn('datav/datav-vue-logo.png'));
    background-color: #2c3e50;
    background-repeat: no-repeat;
    background-size: 25%;
    background-position: 50% 70%;
    box-shadow: 0 0 0 5px rgb(0 0 0 / 10%);
  }

  .live2d-cover-text {
    position: absolute;
    bottom: 30%;
    font-size: 2em;
    left: 50%;
    font-weight: bold;
    color: #44bb85;
    transform: translateX(-50%);
  }

  .live2d-cover-line {
    position: absolute;
    background: rgb(255 255 255 / 10%);
    width: 100%;
    height: 10px;
    bottom: 0;
  }

  .live2d-cover-handle {
    position: absolute;
    background: #ccc;
    bottom: -2px;
    box-shadow: 0 1px 0 1px rgb(0 0 0 / 10%);
    height: 8px;
    left: 50%;
    margin-left: -15px;
    width: 30px;
    cursor: pointer;
  }
}

#live2d {
  height: 300px;
  width: 300px;
  margin-left: 60px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
