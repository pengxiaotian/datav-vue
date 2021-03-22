<template>
  <div class="my-project">
    <div class="project-main">
      <div class="project-manage">
        <div class="manage-title">
          <div class="my-project project-group">
            <span style="margin-left: 2px;">我的分组</span>
            <i class="el-icon-plus btn-add-icon" @click="toAddGroup"></i>
          </div>
          <div
            class="my-project project-all"
            :class="{ 'project-checked-color': selectedGroupId === group.id }"
            @click="toggleProject(group.id)"
          >
            <span>{{ group.name }}</span>
            <span class="project-num">{{ group.children.length }}</span>
          </div>
        </div>

        <div class="manage-main">
          <div
            class="main-project"
            :class="{ 'project-checked-color': selectedGroupId === ungroup.id }"
            @click="toggleProject(ungroup.id)"
          >
            <span class="project-name project-ungrouped">{{ ungroup.name }}</span>
            <span class="project-num">{{ ungroup.children.length }}</span>
          </div>
          <div
            v-for="g in groups"
            :key="g.id"
            class="main-project group-project"
            :class="{ 'project-checked-color': selectedGroupId === g.id }"
            @click="toggleProject(g.id)"
          >
            <span class="project-name">{{ g.name }}</span>
            <span class="project-num">{{ g.children.length }}</span>
            <span class="group-btns">
              <i class="v-icon-edit"></i>
              <i class="v-icon-delete" @click="confirmDeleteGroup(g)"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="project-screen-list">
        <project-list :group="selectedGroup" />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, provide } from 'vue'
import { ProjectGroup, ProjectStore } from '@/domains/project'
import { MessageBoxUtil } from '@/utils/message-util'
import ProjectList from './project-list.vue'

export default defineComponent({
  name: 'MyProject',
  components: {
    ProjectList,
  },
  setup() {
    const {
      group, ungroup, groups,
      deleteProject, deleteProjectGroup,
    } = ProjectStore()
    const selectedGroupId = ref(-1)

    const toggleProject = (id: number) => {
      selectedGroupId.value = id
    }

    const selectedGroup = computed(() => {
      if (selectedGroupId.value === -1) {
        return group.value
      }

      if (selectedGroupId.value === 0) {
        return ungroup.value
      }

      return groups.value.find(g => g.id === selectedGroupId.value)
    })

    provide('deleteProject', deleteProject)

    const confirmDeleteGroup = (group: ProjectGroup) => {
      MessageBoxUtil.confirmAsync(
        `${group.name} 删除后无法恢复，该分组中的可视化应用将全部移动到未分组，确认删除？`,
        () => {
          return deleteProjectGroup(group.id)
        },
        {
          success: () => {
            toggleProject(ungroup.value.id)
          },
        })
    }

    return {
      group,
      ungroup,
      groups,
      selectedGroup,
      selectedGroupId,
      toggleProject,
      confirmDeleteGroup,
    }
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
    color: #fff;
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

    .my-project {
      line-height: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 30px;
    }

    .manage-title {
      .project-group {
        padding-left: 24px;
        height: 56px;
        border-bottom: 1px solid $nav-border-color;
      }

      .btn-add-icon {
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }
    }

    .project-ungrouped {
      color: $font-color;
    }

    .project-all {
      padding-left: 50px;
      transition: color 0.2s;
      cursor: pointer;

      &:hover {
        color: $color-primary;
      }
    }

    .project-checked-color {
      background-image: url('~@/assets/images/nav-menu-img.png');
      background-repeat: round;

      &:hover {
        color: #fff !important;
      }

      .project-name {
        color: #fff !important;
      }
    }

    .project-num {
      user-select: none;
      font-family: Orbitron-Bold, Microsoft Yahei;
      color: $font-color;
    }

    .group-btns {
      display: none;
      color: $color-primary;

      i + i {
        margin-left: 10px;
      }
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
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      &:hover {
        .project-name {
          color: $color-primary;
        }
      }
    }

    .group-project {
      &:hover {
        .project-num {
          display: none;
        }

        .group-btns {
          display: inline-block;
        }
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
