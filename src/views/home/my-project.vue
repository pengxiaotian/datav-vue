<template>
  <div class="my-project">
    <div class="project-main">
      <div class="project-manage">
        <div class="manage-title">
          <div class="my-project project-group">
            <span>
              <i class="v-icon-app" style="margin-right: 2px;"></i> 我的分组
            </span>
            <i class="v-icon-lock"></i>
          </div>
          <div class="my-project project-all project-checked-color">
            <span>全部应用</span>
            <span class="project-num">3</span>
          </div>
        </div>
        <div class="manage-main">
          <div class="main-project project-checked-color">
            <span class="project-name project-ungrouped project-checked-span-color">未分组</span>
            <span class="project-num project-block">3</span>
          </div>
        </div>
      </div>
      <div class="project-screen-list"></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyProject',
  setup() {
    // init here
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.my-project {
  position: relative;
  user-select: none;

  .project-main {
    display: flex;
    flex: 1;
  }

  .project-manage {
    min-width: 240px;
    max-width: 240px;
    color: $color-white;
    position: sticky;
    top: 70px;
    font-size: 14px;
    overflow-y: auto;
    height: calc(100vh - 300px);

    .manage-main {
      display: flex;
      flex-direction: column;
      font-size: 12px;
    }

    .project-group {
      padding-left: 24px;
      height: 56px;
      border-bottom: 1px solid $nav-border-color;
    }

    .my-project {
      line-height: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 30px;
    }

    .project-all {
      padding-left: 50px;
      transition: color 0.2s;
      cursor: pointer;
    }

    .project-checked-color {
      background-image: url('~@/assets/images/nav-menu-img.png');
      background-repeat: round;
    }

    .project-checked-span-color {
      color: $color-white;
    }

    .project-num {
      user-select: none;
      font-family: Orbitron-Bold, Microsoft Yahei;
      color: $font-color;
    }

    .main-project {
      position: relative;
      height: 36px;
      padding: 0 30px 0 50px;
      display: flex;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: color 0.2s;

      .project-name {
        width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .project-ungrouped {
        font-size: 14px;
      }
    }
  }

  .project-screen-list {
    padding-left: 20px;
    padding-right: 50px;
    width: 100%;
  }
}
</style>
