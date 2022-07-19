<template>
  <div class="basic-setting-wp">
    <g-field label="图表尺寸" :is-flat="true">
      <g-input-number
        v-model="com.scaling.w"
        :min="10"
        :max="888888"
        inline
        @update:modelValue="updateWidth"
      />
      <g-input-number
        v-model="com.scaling.h"
        :min="10"
        :max="888888"
        inline
        @update:modelValue="updateHeight"
      />
    </g-field>
    <g-field label="图表位置" :is-flat="true">
      <g-input-number v-model="com.attr.x" inline />
      <g-input-number v-model="com.attr.y" inline />
    </g-field>
    <g-field label="旋转角度" :is-flat="true">
      <g-input-number
        v-model="com.attr.deg"
        :min="0"
        :max="360"
        :step="1"
        inline
      />
      <div class="rotate-flip-wp">
        <n-tooltip>
          <template #trigger>
            <button
              class="hor"
              :class="{ '--checked': filps.includes('h') }"
              @click="onFilpChange('h')"
            >
              <n-icon>
                <IconFlipH />
              </n-icon>
            </button>
          </template>
          水平翻转
        </n-tooltip>
        <n-tooltip>
          <template #trigger>
            <button
              class="ver"
              :class="{ '--checked': filps.includes('v') }"
              @click="onFilpChange('v')"
            >
              <n-icon>
                <IconFlipV />
              </n-icon>
            </button>
          </template>
          垂直翻转
        </n-tooltip>
      </div>
    </g-field>
    <g-field label="透明度">
      <g-slider
        v-model="com.attr.opacity"
        :min="0"
        :max="1"
        :step="0.05"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, inject } from 'vue'
import { IconFlipV, IconFlipH } from '@/icons'
import { comInjectionKey } from '../config'

type filpType = 'v' | 'h'

export default defineComponent({
  name: 'BasicSetting',
  components: {
    IconFlipV,
    IconFlipH,
  },
  setup() {
    const com = inject(comInjectionKey)
    const filps = ref<filpType[]>([])

    const updateWidth = (val: number) => {
      com.value.attr.w = val
    }

    const updateHeight = (val: number) => {
      com.value.attr.h = val
    }

    const onFilpChange = (key: filpType) => {
      if (filps.value.includes(key)) {
        filps.value = filps.value.filter(m => m !== key)
      } else {
        filps.value.push(key)
      }
      com.value.attr.filpV = filps.value.includes('v')
      com.value.attr.filpH = filps.value.includes('h')
    }

    onMounted(() => {
      if (com.value.attr.filpV) {
        filps.value.push('v')
      }

      if (com.value.attr.filpH) {
        filps.value.push('h')
      }
    })

    return {
      com,
      filps,
      updateWidth,
      updateHeight,
      onFilpChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.basic-setting-wp {
  user-select: none;
}

.rotate-flip-wp {
  display: inline-block;
  width: 92px;
  flex: 0 0 92px;
  padding-bottom: 4px;

  .hor,
  .ver {
    display: inline-block;
    width: 28px;
    height: 28px;
    border: var(--datav-outline);
    cursor: pointer;
    color: var(--datav-font-color);
    background-color: var(--datav-gui-component-bgcolor);

    &.--checked,
    &:hover {
      border-color: var(--datav-main-color);
    }

    &:active {
      background: rgb(0 0 0 / 50%);
    }
  }

  .hor {
    margin-right: 4px;
  }
}
</style>
