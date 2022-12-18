<template>
  <div class="config-manager-page">
    <div class="config-manager-head">排列布局</div>
    <div class="config-manager-body">
      <div class="multi-layout-config">
        <g-field label="对齐">
          <n-icon class="datav-icon" title="左对齐" @click="alignLeft">
            <IconAlignLeft />
          </n-icon>
          <n-icon class="datav-icon" title="水平居中对齐" @click="alignCenter">
            <IconAlignCenter />
          </n-icon>
          <n-icon class="datav-icon" title="右对齐" @click="alignRight">
            <IconAlignRight />
          </n-icon>
          <n-icon class="datav-icon" title="顶对齐" @click="alignTop">
            <IconAlignTop />
          </n-icon>
          <n-icon class="datav-icon" title="垂直居中对齐" @click="alignMiddle">
            <IconAlignMiddle />
          </n-icon>
          <n-icon class="datav-icon" title="底对齐" @click="alignBottom">
            <IconAlignBottom />
          </n-icon>
        </g-field>
        <g-field label="分布">
          <n-icon
            class="datav-icon"
            :class="{ disable: selectedCount < 3 }"
            title="水平"
            @click="alignHorizontal"
          >
            <IconAlignHorizontal />
          </n-icon>
          <n-icon
            class="datav-icon"
            :class="{ disable: selectedCount < 3 }"
            title="垂直"
            @click="alignVertical"
          >
            <IconAlignVertical />
          </n-icon>
        </g-field>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { maxBy, minBy, sortBy } from 'lodash-es'
import {
  IconAlignLeft, IconAlignCenter, IconAlignRight,
  IconAlignTop, IconAlignMiddle, IconAlignBottom,
  IconAlignHorizontal, IconAlignVertical,
} from '@/icons'
import { useComStore } from '@/store/com'

defineProps<{
  selectedCount: number
}>()

const comStore = useComStore()

const resizeBox = () => {
  const pid = comStore.selectedComs[0].parentId
  const ps = comStore.getParents(pid)
  comStore.resizeParents(ps)
}

const alignLeft = () => {
  const minCom = minBy(comStore.selectedComs, com => com.attr.x)
  comStore.selectedComs.forEach(com => {
    com.attr.x = minCom.attr.x
  })
  resizeBox()
}

const alignCenter = () => {
  const maxCom = maxBy(comStore.selectedComs, com => com.attr.w)
  comStore.selectedComs.forEach(com => {
    const diff = maxCom.attr.w - com.attr.w
    com.attr.x = maxCom.attr.x + Math.round(diff / 2)
  })
  resizeBox()
}

const alignRight = () => {
  const maxCom = maxBy(comStore.selectedComs, com => com.attr.w)
  comStore.selectedComs.forEach(com => {
    com.attr.x = maxCom.attr.x + maxCom.attr.w - com.attr.w
  })
  resizeBox()
}

const alignTop = () => {
  const minCom = minBy(comStore.selectedComs, com => com.attr.y)
  comStore.selectedComs.forEach(com => {
    com.attr.y = minCom.attr.y
  })
  resizeBox()
}

const alignMiddle = () => {
  const maxCom = maxBy(comStore.selectedComs, com => com.attr.h)
  comStore.selectedComs.forEach(com => {
    const diff = maxCom.attr.h - com.attr.h
    com.attr.y = maxCom.attr.y + Math.round(diff / 2)
  })
  resizeBox()
}

const alignBottom = () => {
  const maxCom = maxBy(comStore.selectedComs, com => com.attr.h)
  comStore.selectedComs.forEach(com => {
    com.attr.y = maxCom.attr.y + maxCom.attr.h - com.attr.h
  })
  resizeBox()
}

const alignHorizontal = () => {
  const ascComs = sortBy(comStore.selectedComs, com => com.attr.x)
  const num = ascComs.length
  const minX = ascComs[0].attr.x
  const { x: maxX, w: maxW } = ascComs[num - 1].attr
  const targetWidth = maxX + maxW - minX
  const totalWidth = ascComs.reduce((sum, com) => sum + com.attr.w, 0)
  const gap = Math.floor((targetWidth - totalWidth) / (ascComs.length - 1))
  let horizontalTotalOffset = 0
  ascComs.forEach(com => {
    com.attr.x = minX + horizontalTotalOffset
    horizontalTotalOffset += gap + com.attr.w
  })
  resizeBox()
}

const alignVertical = () => {
  const ascComs = sortBy(comStore.selectedComs, com => com.attr.y)
  const num = ascComs.length
  const minY = ascComs[0].attr.y
  const { y: maxY, h: maxH } = ascComs[num - 1].attr
  const targetHeight = maxY + maxH - minY
  const totalHeight = ascComs.reduce((sum, com) => sum + com.attr.h, 0)
  const gap = Math.floor((targetHeight - totalHeight) / (ascComs.length - 1))
  let verticalTotalOffset = 0
  ascComs.forEach(com => {
    com.attr.y = minY + verticalTotalOffset
    verticalTotalOffset += gap + com.attr.h
  })
  resizeBox()
}
</script>

<style lang="scss" scoped>
@import './config.scss';

.multi-layout-config {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 12px;
  color: var(--datav-gui-font-color-1);

  .datav-icon {
    display: inline-block;
    margin-right: 0.5em;
    font-size: 16px;
    color: var(--datav-font-color);
    background: var(--datav-component-bg);
    padding: 2px;
    border-radius: 1px;
    transition: 0.2s;
    cursor: pointer;
    width: 20px;
    height: 20px;

    &.disable {
      opacity: 0.3;

      &:hover {
        color: #0000;
      }
    }

    &:not(.disable):hover {
      color: #fff;
      background: var(--datav-main-color);
    }
  }
}

</style>
