<template>
  <div
    :title="com.alias"
    :class="{
      'layer-manager-com': com.type === ComType.com,
      'layer-manager-group': com.type === ComType.layer,
      'layer-manager-item': true,
      'layer-manager-thumbail-wrap': !showText,
      '--child-hovered': childState.hovered || dragGroupHover,
      '--child-selected': childState.selected,
      hided: com.hided,
      locked: com.locked,
      hovered: com.hovered,
    }"
    :style="{
      paddingLeft: `${6 + level * 10}px`
    }"
    draggable="true"
    @mouseenter="toggleHover(1)"
    @mouseleave="toggleHover(0)"
    @contextmenu="showMenu($event, com)"
  >
    <template v-if="com.type === ComType.layer">
      <n-icon class="fold-toggle-btn" :class="{ 'icon-fold': com.fold }">
        <IconArrowRight />
      </n-icon>
      <n-icon class="layer-item-icon">
        <IconGroup />
      </n-icon>
    </template>

    <template v-if="showText">
      <g-com-icon v-if="com.type === ComType.com" :icon="com.icon" />
      <input
        v-if="com.renameing"
        v-model.trim="com.alias"
        v-focus
        class="layer-item-input"
        @blur="toggleRename(0)"
        @keydown.enter="toggleRename(0)"
      >
      <span v-else class="layer-item-span">
        <span class="layer-item-text" @dblclick="toggleRename(1)">
          {{ com.alias }}
        </span>
      </span>
      <n-icon v-if="com.hided" class="show-toggle-btn" @click="toggleHide(0)">
        <IconHide />
      </n-icon>
      <n-icon v-if="com.locked" class="show-toggle-btn" @click="toggleLock(0)">
        <IconLock />
      </n-icon>
    </template>
    <template v-else>
      <div
        v-if="com.type === ComType.com"
        class="layer-item-thumbail"
        :style="`background-image: url(${com.img})`"
      ></div>

      <div class="layer-manager-thumbail">
        <input
          v-if="com.renameing"
          v-model.trim="com.alias"
          v-focus
          class="layer-item-input"
          @blur="toggleRename(0)"
          @keydown.enter="toggleRename(0)"
        >
        <span
          v-else
          class="layer-item-span"
          @dragenter="dragEnterGroup"
          @dragleave="dragLeaveGroup"
          @drop="dropGroup"
        >
          <span class="layer-item-text" @dblclick="toggleRename(1)">
            {{ com.alias }}
          </span>
        </span>
      </div>
      <div class="layer-thumbail-item">
        <n-icon v-if="com.hided" class="show-toggle-btn" @click="toggleHide(0)">
          <IconHide />
        </n-icon>
        <n-icon v-if="com.locked" class="show-toggle-btn" @click="toggleLock(0)">
          <IconLock />
        </n-icon>
      </div>
    </template>
    <div
      v-if="com.type === ComType.layer"
      class="group-fold-controller"
      :style="{
        width: `${level > 0 ? 50 : 40}px`,
        transform: `translateX(-${6 + level * 10}px)`
      }"
      @mouseup.stop="toggleFold"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { DatavComponent, ComType } from '@/components/_models/datav-component'
import {
  IconLock,
  IconHide,
  IconGroup,
  IconArrowRight,
} from '@/icons'
import { getChildState } from '@/store/com'
import { useContextMenu } from '../editor-context-menu'

const props = defineProps<{
  com: DatavComponent
  level: number
  showText: boolean
}>()

const emits = defineEmits(['dragGroup'])

const { showMenu } = useContextMenu()

const dragGroupHover = ref(false)

const childState = computed(() => {
  return getChildState(props.com)
})

const toggleRename = (flag: number) => {
  props.com.renameing = flag === 1
}

const toggleHover = (flag: number) => {
  props.com.hovered = props.com.selected ? false : flag === 1
}

const toggleHide = (flag: number) => {
  props.com.hided = flag === 1
}

const toggleLock = (flag: number) => {
  props.com.locked = flag === 1
}

const toggleFold = () => {
  props.com.fold = !props.com.fold
}

const dragEnterGroup = () => {
  if (props.com.type === ComType.layer) {
    dragGroupHover.value = true
    emits('dragGroup', { key: 'enter' })
  }
}

const dragLeaveGroup = () => {
  if (props.com.type === ComType.layer) {
    dragGroupHover.value = false
    emits('dragGroup', { key: 'leave' })
  }
}

const dropGroup = () => {
  if (props.com.type === ComType.layer) {
    dragGroupHover.value = false
    emits('dragGroup', {
      key: 'drop',
      level: props.level + 1,
      com: props.com.children[0],
    })
  }
}
</script>

<style lang="scss" scoped>

.layer-manager-item {
  position: relative;
  display: flex;
  width: 100%;
  height: 32px;
  padding: 0 2px;
  cursor: pointer;
  background: var(--datav-layer-item-bg);
  box-sizing: border-box;
  transition: 0.2s;
  align-items: center;
  flex: none;

  &.layer-manager-thumbail-wrap {
    height: 48px;

    .fold-toggle-btn {
      line-height: 48px;
    }
  }

  &.--child-hovered {
    color: #fff;
    background: rgb(143 225 255 / 10%);
  }

  &.--child-selected {
    color: #fff;
    background: rgb(143 225 255 / 7%);
  }

  &.hided,
  &.locked {
    color: var(--datav-layer-item-color-locked);
    background: var(--datav-layer-item-bg-locked);
  }

  &.hovered {
    color: #fff;
    background: rgb(143 225 255 / 10%);
  }

  &.selected {
    color: #fff;
    background: var(--datav-main-color);
  }

  .layer-item-thumbail {
    width: 53px;
    height: 34px;
    flex: none;
    display: block;
    border: var(--datav-border);
    background: var(--datav-layer-item-thumbail-bg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .layer-manager-thumbail {
    flex: auto;
    width: 0;
    margin-left: 6px;
  }

  .layer-item-span {
    flex: auto;
    display: flex;
    flex-direction: row;
    align-items: center;

    .layer-item-text {
      flex: 0 1 auto;
      text-indent: 7px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .layer-item-input {
    width: 100%;
    color: var(--datav-font-color);
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
    background: 0 0;
    border: none;
    outline: 0;
    font-size: 12px;
    text-indent: 2px;

    &:focus {
      color: #fff;
      background: var(--datav-layer-input-bg);
    }
  }

  .layer-thumbail-item {
    position: absolute;
    top: 3px;
    right: 4px;
    line-height: 1;
  }

  .show-toggle-btn {
    padding: 0 2px;
  }

  .fold-toggle-btn {
    font-size: 12px;
    transform-origin: 50% 50%;
    transform: rotate(90deg);
    transition: transform 0.2s ease;
    height: 100%;
    line-height: 32px;

    &.icon-fold {
      transform: rotate(0);
    }
  }

  .layer-item-icon {
    font-size: 16px;
    margin-left: 4px;
  }

  .group-fold-controller {
    float: left;
    position: absolute;
    height: 100%;
  }
}
</style>
