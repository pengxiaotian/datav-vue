<template>
  <div class="datav">
    <nav-header :is-fixed="isFixed" />
    <nav-main
      ref="navMainRef"
      :navs="navs"
      :style="{ background: isFixed ? '#171b22' : '' }"
    />
    <div class="nav-shadow"></div>
    <div class="datav-main">
      <div class="datav-content">
        <my-project />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import NavHeader from './nav-header.vue'
import NavMain from './nav-main.vue'
import MyProject from './my-project.vue'

export default defineComponent({
  name: 'Home',
  components: {
    NavHeader,
    NavMain,
    MyProject,
  },
  setup() {
    const navMainRef = ref<any>(null)
    const isFixed = ref(false)
    const navs = ref([
      { id: 0, name: '我的可视化', icon: 'layer' },
      { id: 1, name: '我的数据', icon: 'my-data' },
      { id: 2, name: '我的组件', icon: 'my-com' },
      { id: 3, name: '教程', icon: 'tutorial' },
    ])

    const scroll = () => {
      isFixed.value = navMainRef.value.$el.offsetTop > 200
    }

    onMounted(() => {
      window.addEventListener('scroll', scroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', scroll)
    })

    return {
      navMainRef,
      isFixed,
      navs,
    }
  },
  mounted() {
    this
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.datav {
  .nav-shadow {
    background: linear-gradient(180deg, transparent, $background-color);
    height: 50px;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .datav-main {
    user-select: none;

    .datav-content {
      position: relative;
      color: $background-color;
    }
  }
}
</style>
