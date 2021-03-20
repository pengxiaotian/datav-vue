<template>
  <div class="nav-main">
    <canvas id="nav-canvas" style="position: absolute; z-index: -1; left: 0;"></canvas>
    <span v-for="nav in navs" :key="nav.id" class="nav-span">
      <a
        class="nav-link"
        :class="{ 'nav-active': activeNav === nav.id }"
        @click="toggleNav(nav.id)"
      >
        <i :class="`v-icon-${nav.icon} nav-icon`"></i>{{ nav.name }}
      </a>
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import _ from 'lodash'
import { NavCanvas } from './nav-canvas'

interface NavDataType {
  id: number
  name: string
  icon: string
}

export default defineComponent({
  name: 'NavMain',
  props: {
    navs: {
      type: Array as PropType<NavDataType[]>,
      required: true,
    },
  },
  setup() {
    const activeNav = ref(0)
    let nc: NavCanvas | null = null

    const toggleNav = (idx: number) => {
      if (nc) {
        activeNav.value = idx
        nc.toggle(idx)
      }
    }

    const debNavResize = _.debounce(() => {
      if (nc) {
        nc.resize()
      }
    }, 500)

    onMounted(() => {
      nc = new NavCanvas('nav-canvas', '.nav-main .nav-span')
      window.addEventListener('resize', debNavResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize',debNavResize)
    })

    return {
      toggleNav,
      activeNav,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.nav-main {
  z-index: 10;
  display: flex;
  top: 30px;
  position: sticky;
  width: 100%;
  margin-top: 200px;
  min-width: 1024px;
  user-select: none;

  .nav-span {
    .nav-link {
      transition: color 0.2s;
      text-decoration: none !important;
      display: block;
      color: $nav-color;
      width: auto;
      min-width: 140px;
      line-height: 40px;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      padding: 0 40px;

      &.nav-active,
      &:hover {
        color: #fff !important;
      }
    }

    .nav-icon {
      padding-right: 5px;
      font-size: 16px;
    }
  }
}
</style>
