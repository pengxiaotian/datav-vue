<template>
  <div class="live2d-wrap">
    <div class="live2d-cover" :style="{ bottom: cover ? '20%' : '80%' }">
      <div class="live2d-cover-text">
        <span style="color: cyan;">MIMI</span>
        <span style="color: white;">POWERED</span>
      </div>
      <div class="live2d-cover-line"></div>
      <div class="live2d-cover-handle" @click="cover = !cover"></div>
    </div>
    <canvas id="live2d" width="500" height="500"></canvas>
  </div>
</template>

<script>
import '@/assets/live2d/live2d.min.js'

const apiPath = 'https://live2d.fghrsh.net/api'

export default {
  name: 'Live2d',
  data() {
    return {
      modelId: '1',
      modelTexturesId: '53',
      cover: true,
    }
  },
  mounted() {
    this.loadModel()
    this.initPassword()
  },
  methods: {
    loadModel() {
      const { modelId, modelTexturesId } = this
      loadlive2d('live2d', `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, null)

      setTimeout(() => {
        this.cover = false
      }, 2000)
    },
    loadRandModel() {
      this.cover = true
      const { modelId, modelTexturesId } = this
      fetch(`${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`)
        .then(response => response.json())
        .then(result => {
          loadModel(modelId, result.textures.id)
        })
    },
    initPassword() {
      const pwd = document.querySelector('input[type=password]')
      if (pwd) {
        pwd.addEventListener('focus', () => {
          this.cover = true
        })
        pwd.addEventListener('blur', () => {
          this.cover = false
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.live2d-wrap {
  position: relative;
  background-color: #999;
  clip-path: circle(120px at center);

  .live2d-cover {
    position: absolute;
    background-color: #cb3837;
    width: 100%;
    height: 100%;
    bottom: 10%;
    transition: all 1s;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .live2d-cover-text {
    position: absolute;
    bottom: 30%;
    font-size: 2em;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.4;
    font-weight: bold;
  }

  .live2d-cover-line {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
    height: 10px;
    bottom: 0;
  }

  .live2d-cover-handle {
    position: absolute;
    background: #ccc;
    bottom: -2px;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.1);
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
