<template>
  <div class="com-title-wp">
    <n-icon v-if="com.type === ComType.subCom" class="back-icon" @click="back">
      <IconBack />
    </n-icon>
    <div class="com-title">
      <div class="title-name">
        <span class="alias-name">{{ com.alias }}</span>
        <n-tooltip placement="right">
          <template #trigger>
            <n-icon class="com-doc-icon">
              <IconDocument />
            </n-icon>
          </template>
          {{ `${com.name}文档` }}
        </n-tooltip>
      </div>
      <div class="version-tag">
        <span>{{ com.name }}</span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { defineComponent, inject } from 'vue'
import { IconBack, IconDocument } from '@/icons'
import { ComType } from '@/components/_models/datav-component'
import { comInjectionKey } from '../config'
import { useComStore } from '@/store/com'

export default defineComponent({
  name: 'SettingPanel',
  components: {
    IconBack,
    IconDocument,
  },
  setup() {
    const com = inject(comInjectionKey)
    const comStore = useComStore()

    const back = () => {
      comStore.selectSubCom('')
    }

    return {
      ComType,
      com,
      back,
    }
  },
})
</script>

<style lang="scss" scoped>
.com-title-wp {
  position: relative;
  display: flex;
  height: 60px;
  padding-top: 12px;
  padding-right: 8px;
  color: #fff;
  align-items: flex-start;
  justify-content: space-between;

  .back-icon {
    display: inline-block;
    padding-left: 5px;
    cursor: pointer;
    transform: scale(0.8);
    line-height: 24px;
  }

  .com-title {
    padding-right: 5px;
    padding-left: 10px;
    overflow: hidden;
    flex: 1;

    .title-name {
      display: flex;
      padding-bottom: 3px;
      font-size: 14px;
      flex-wrap: nowrap;
      align-items: center;
    }

    .alias-name {
      max-width: 160px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .com-doc-icon {
      margin-left: 4px;
      font-size: 12px;
      color: #f8b81c;
      cursor: pointer;
    }

    .version-tag {
      display: flex;
      font-size: 12px;
      color: #647279;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
}
</style>
