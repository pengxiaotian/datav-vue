<template>
  <div class="icons-page">
    <n-grid x-gap="24" y-gap="40" :cols="8">
      <n-gi v-for="(item, key) of Icons" :key="key">
        <div class="icon-item" @click="copyName(key)">
          <n-icon size="30">
            <component :is="item" />
          </n-icon>
          <div class="icon-name">{{ key }}</div>
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import * as Icons from '@/icons'
import { copyText } from '@/utils/util'

const nMessage = useMessage()

const copyName = (name: string) => {
  copyText(name).then(() => {
    nMessage.success('复制成功')
  })
}
</script>

<style lang="scss" scoped>
.icons-page {
  height: 100vh;
  padding: 48px;
  overflow-y: auto;

  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    border: 1px solid #0000;
    border-radius: 4px;
    padding: 16px 0;
    color: #fff;

    &:hover {
      border: var(--datav-border-primary);
    }

    .icon-name {
      padding-top: 10px;
    }
  }
}
</style>
