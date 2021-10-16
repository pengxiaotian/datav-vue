<template>
  <div class="datav">
    <nav-header :is-fixed="isFixed" />
    <nav-main
      ref="navMainRef"
      :navs="navs"
      :style="{ background: isFixed ? 'var(--datav-body-bg)' : '' }"
      @change="onNavChange"
    />
    <div class="nav-shadow"></div>
    <div class="datav-main">
      <div class="datav-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from './nav-header.vue'
import NavMain from './nav-main.vue'

export default defineComponent({
  name: 'Home',
  components: {
    NavHeader,
    NavMain,
  },
  setup() {
    const navMainRef = ref(null)
    const isFixed = ref(false)

    const navs = ref([
      { id: 0, key: 'MyProject', name: '我的可视化' },
      { id: 1, key: 'MyData', name: '我的数据' },
      { id: 2, key: 'MyCom', name: '我的组件' },
      { id: 3, key: 'MyCase', name: '教程' },
    ])

    const router = useRouter()

    const scroll = () => {
      isFixed.value = navMainRef.value.$el.offsetTop > 200
    }

    const onNavChange = (nav: any) => {
      router.push({ name: nav.key })
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
      onNavChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.datav {
  .nav-shadow {
    background: linear-gradient(180deg, transparent, var(--datav-body-bg));
    height: 50px;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .datav-main {
    user-select: none;

    .datav-content {
      position: relative;
      color: var(--datav-body-bg);
    }
  }
}
</style>
