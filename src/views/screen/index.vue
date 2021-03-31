<template>
  <el-container class="edit-container">
    <el-header style="height: auto; padding: 0;">
      <toolbar :screen="srceen" />
    </el-header>
    <el-container class="edit-main-wp">
      <el-container class="edit-main">
        <!-- <canvas-main /> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted } from 'vue'
import { ScreenStore } from '@/domains/screen'
import toolbar from './toolbar/index.vue'

export default defineComponent({
  name: 'Screen',
  components: {
    toolbar,
  },
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const screenId = computed(() => {
      return typeof props.projectId === 'string'
        ? parseInt(props.projectId) : props.projectId
    })

    const {
      loading,
      srceen,
      getScreenInfo,
    } = ScreenStore()

    onMounted(() => {
      getScreenInfo(screenId.value)
    })

    return {
      screenId,
      loading,
      srceen,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.edit-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.edit-main-wp {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
  background: url('~@/assets/images/bg-canvas.png');
  flex-wrap: nowrap;
}

.edit-main {
  position: relative;
  z-index: 2;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
}
</style>
