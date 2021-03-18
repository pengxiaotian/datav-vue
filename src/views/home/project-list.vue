<template>
  <div>
    <div class="new-projects-title">选择下面的方式进行创建</div>
    <div class="new-projects">
      <div class="new-project">
        <img src="@/assets/images/new-project.png">
        <span class="project-type ellipsis">PC端创建</span>
      </div>
    </div>
    <div class="project-header">
      <div class="project-title">
        <h2>全部应用</h2>
      </div>
      <div class="header-manager">
        <div class="search">
          <input class="search-input" placeholder="搜索" value="">
        </div>
        <i class="v-icon-search"></i>
        <g-drop-list-popover trigger="click">
          <div class="sort-type">
            <span class="sort-text" :title="sorts[sort]">
              {{ sorts[sort] }}
            </span>
            <i class="el-icon-caret-bottom arrow-icon"></i>
          </div>
          <template #droplist>
            <g-drop-list>
              <g-drop-list-item
                v-for="(v, k) in sorts"
                :key="k"
                @click="onSortChange(k)"
              >
                {{ v }}
              </g-drop-list-item>
            </g-drop-list>
          </template>
        </g-drop-list-popover>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProjectList',
  setup() {
    const sort = ref('name')
    const sorts = ref({
      name: '按名称排序',
      created: '按创建时间排序',
      updated: '按修改时间排序',
    })

    const onSortChange = (key: string) => {
      sort.value = key
    }

    return {
      sort,
      sorts,
      onSortChange,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';
@import '~@/styles/mixins/util';

.ellipsis {
  @include utils-ellipsis;

  display: block;
}

.new-projects-title {
  font-size: 14px;
  font-weight: 700;
  color: $color-primary;
  padding: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.new-projects {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: -32px;

  .new-project {
    width: 258px;
    height: 78px;
    margin: 16px 32px 16px 0;
    vertical-align: middle;
    border: 1px solid #39414d;
    background: #22272e;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    color: #fff;

    img {
      width: 150px;
      height: 100%;
    }

    &:hover {
      border-color: $color-primary;

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(36, 131, 255, 0.08);
      }
    }
  }

  .project-type {
    padding-left: 8px;
    flex: 1;
    font-size: 14px;
  }
}

.project-header {
  position: sticky;
  top: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $border-color;
  padding-bottom: 5px;
  padding-top: 10px;
  height: 56px;
  background: $background-color;
  z-index: 1;
  min-width: 1024px;

  .project-title {
    display: flex;
    align-items: center;
    padding: 5px 0;

    h2 {
      @include utils-ellipsis;

      max-width: 200px;
      font-size: 14px;
      color: $color-primary;
      padding: 0 10px;
      border-left: 2px solid $color-primary;
    }
  }

  .header-manager {
    display: flex;
    align-items: center;
    font-size: 14px;

    .search {
      transform: translateX(30px);

      .search-input {
        @include utils-ellipsis;

        background: $input-background-color;
        color: #fff;
        padding: 0 10px;
        line-height: 30px;
        height: 30px;
        padding-right: 30px;
        border: 1px solid transparent;
        transition: 0.2s;

        &:hover {
          box-shadow: 0 0 10px -6px #000;
          border: 1px solid $color-primary;
        }
      }
    }

    .v-icon-search {
      padding: 0 24px 0 4px;
      color: $font-color;
      cursor: pointer;
      z-index: 1;
    }

    .sort-type {
      @include utils-ellipsis;

      display: inline-block;
      color: $font-color;
      line-height: 30px;
      cursor: pointer;
      font-size: 14px;
      min-width: 100px;

      .arrow-icon {
        font-size: 14px;
        margin-left: 4px;
      }

      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>
