<template>
  <div class="my-screen">
    <div class="screen">
      <div class="screen-info">
        <div class="screen-img"></div>
        <div class="screen-edit">
          1
        </div>
      </div>
      <div class="screen-main">
        <div class="main-name">
          <div class="screen-name-input">
            <i class="datav-icon datav-font icon-edit edit"></i>
            <input class="input" value="数据分析">
          </div>
          <div class="publish-info">
            <span class="name-icon color-576369">
            </span><span>未发布</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyScreen',
  props: { },
  setup() {
    // init here
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.my-screen {
  margin: 16px 32px 16px 0;
}

.screen {
  display: flex;
  flex-direction: column;
  width: 258px;
  height: 184px;
  border: 1px solid #3a4659;
  transition: 0.2s;

  .screen-info {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .screen-edit {
      position: absolute;
      opacity: 0;
      display: flex;
      width: 100%;
      height: 100%;
      pointer-events: none;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
      background: rgba(0, 0, 0, 0.81);
    }
  }

  &:hover {
    box-shadow: 0 0 10px -2px #000;
    border: 1px solid $color-primary;

    .screen-info .screen-edit {
      opacity: 1;
      pointer-events: all;
    }
  }

  .screen-main {
    .main-name {
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;
      position: relative;
      justify-content: space-between;
      color: #fff;
      background: #1d262e;
      padding: 0 10px;
    }
  }
}
</style>
