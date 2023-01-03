<template>
  <div class="page">
    <n-card
      embedded
      hoverable
      :style="{
        width: '300px',
        height: '150px',
        margin: 'auto',
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        transform: 'translateY(-50%)',
        '--n-border-radius': '4px',
        '--n-border-color': 'rgb(239, 239, 245)',
        '--n-box-shadow': '0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)',
      }"
      :header-style="{
        'padding-bottom': '4px',
      }"
    >
      <template #header>
        <n-gradient-text
          gradient="-webkit-linear-gradient(315deg, #42d392 25%, #647eff);"
        >
          <n-icon :component="IconV" color="#42d392" :size="20" />
          DataV CLI UI
        </n-gradient-text>
      </template>
      <n-ul>
        <n-li>
          <n-button text tag="a" href="/icons">
            全部图标
          </n-button>
        </n-li>
        <n-li>
          <n-button text tag="a" href="/attr-settings">
            组件属性设置
          </n-button>
        </n-li>
      </n-ul>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import {
  NButton,
  NCard,
  NGradientText,
  NUl,
  NLi,
  NIcon,
} from 'naive-ui'
import { IconV } from '~~/icons'
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
}
</style>
