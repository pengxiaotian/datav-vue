<template>
  <ClientOnly>
    <n-card :bordered="false">
      <n-page-header title="全部图标" @back="handleBack">
        <n-grid x-gap="24" y-gap="40" :cols="8">
          <n-gi v-for="(item, key) of Icons" :key="key">
            <div class="icon-item" @click="copyName(key)">
              <n-icon size="30" :component="item" />
              <div class="icon-name">{{ key }}</div>
            </div>
          </n-gi>
        </n-grid>
      </n-page-header>
    </n-card>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { useMessage, NCard, NPageHeader, NGrid, NGi, NIcon } from 'naive-ui'
import { copyText } from '@/utils/util'
import * as Icons from '@/icons'

const nMessage = useMessage()
const router = useRouter()

const copyName = (name: string) => {
  copyText(name).then(() => {
    nMessage.success('复制成功')
  })
}

const handleBack = () => {
  router.push({ path: '/' })
}
</script>

<style lang="scss" scoped>
.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #0000;
  border-radius: 4px;
  color: #fff;
  padding: 8px;

  &:hover {
    border: var(--datav-border-primary);
  }

  .icon-name {
    padding-top: 10px;
  }
}
</style>
