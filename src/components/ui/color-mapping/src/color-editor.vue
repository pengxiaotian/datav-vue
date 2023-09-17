<template>
  <div class="--color-editor">
    <n-icon v-if="showDelete" :component="IconDelete" class="--delete" />
    <i v-else class="--delete"></i>
    <div
      class="--color-block g-color-mapping__color-block"
      :style="{
        visibility: hideColorBlock ? 'hidden' : 'visible'
      }"
    >
      <span class="--block" :style="`background: ${color};`"></span>
    </div>
    <div class="--color-changer --with-pin">
      <div class="--color-fill">
        <span class="--color-fill-default g-color-mapping__color-block">
          <span class="--block" :style="`background: ${color};`"></span>
        </span>
        <input
          :value="value"
          class="--color-fill-input"
          @blur="handleValue"
        >
      </div>
      <n-tooltip v-if="showPin" placement="top">
        <template #trigger>
          <n-icon
            :component="pin ? IconPinFill : IconPin"
            class="--color-pin"
            @click="handlePin(pin)"
          />
        </template>
        {{ pin ? '已「钉住」，颜色不' : '未「钉住」，颜色将' }}随切换模板而更改
      </n-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NTooltip, NIcon } from 'naive-ui'
import { IconDelete, IconPin, IconPinFill } from '@/icons'

defineProps<{
  color: string
  value: string
  pin?: boolean
  showPin?: boolean
  showDelete?: boolean
  hideColorBlock?: boolean
}>()

const emits = defineEmits(['update-data'])

const handleValue = (event: any) => {
  onUpdateData('color', event.target.value)
}

const handlePin = (val: boolean) => {
  onUpdateData('pin', !val)
}

const onUpdateData = (key: string, value: any) => {
  emits('update-data', { key, value })
}
</script>
