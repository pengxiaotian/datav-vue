<template>
  <div class="com-title-wp">
    <div class="com-title">
      <div class="title-name">
        <span class="alias-name">{{ comAlias }}</span>
        <n-tooltip placement="right">
          <template #trigger>
            <n-icon class="com-doc-icon">
              <IconDocument />
            </n-icon>
          </template>
          {{ `${comTitle}文档` }}
        </n-tooltip>
      </div>
      <div class="version-tag">
        <span>{{ comTitle }}</span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { findComByName } from '@/data/system-components'
import { IconDocument } from '@/icons'

export default defineComponent({
  name: 'SettingPanel',
  components: {
    IconDocument,
  },
  props: {
    comName: {
      type: String,
      required: true,
    },
    comAlias: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const comTitle = computed(() => {
      const obj = findComByName(props.comName)
      return obj?.com.name
    })

    return {
      comTitle,
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
