import { ref, computed } from 'vue'
import _ from 'lodash'
import * as api from '@/api/project'

export enum ProjectGroupType {
  ungroup = 0,
  group = 1
}

export class ProjectGroup {
  id: number
  name: string
  type: ProjectGroupType
  children: Project[]

  constructor(id = 0, name = '', children: Project[] = []) {
    this.id = id
    this.name = name
    this.children = children
    this.type = ProjectGroupType.ungroup
  }
}

export class Project {
  id: number
  name: string
  share: string
  groupId: number
  config: {
    width: number
    height: number
    bgcolor: string
    bgimage: string
    grid: number
    screenshot: string
    zoomMode: number
    useWatermark: boolean
    createAt: string
    updateAt: string
  }
}

export interface ProjectTemplate {
  id: number
  name: string
  size: String[]
  snapshot: string
  thumbnail: string
}

const allGroups = ref<ProjectGroup[]>([])

export const ProjectStore = () => {

  const group = computed(() => {
    const list = allGroups.value.flatMap(m => m.children)
    return new ProjectGroup(-1, '全部应用', list)
  })

  const ungroup = computed(() => {
    const g = allGroups.value.find(m => m.type === ProjectGroupType.ungroup)
    return g ? g : new ProjectGroup(0, '未分组', [])
  })

  const groups = computed(() => {
    return allGroups.value.filter(m => m.type === ProjectGroupType.group)
  })

  const getProjects = async () => {
    try {
      const res = await api.getProjects()
      if (res.data.code === 0) {
        const list: ProjectGroup[] = res.data.data || []

        // TODO: 如果用关系数据库就不用赋值 groupId
        const ungroup = new ProjectGroup(0, '未分组', [])

        list.forEach(item => {
          item.children.forEach((subitem: any) => {
            if (item.type === ProjectGroupType.ungroup) {
              subitem.groupId = 0
              ungroup.children.push(subitem)
            } else {
              subitem.groupId = item.id
            }
          })
        })

        allGroups.value = [ungroup, ...list.filter(m => m.type === ProjectGroupType.group)]
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const deleteProject = async (gid: number, pid: number) => {
    try {
      const res = await api.deleteProject(pid)
      if (res.data.code === 0) {
        const g = allGroups.value.find(m => m.id === gid)
        if (g) {
          g.children = g.children.filter(m => m.id !== pid)
        }
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const moveProject = async (pid: number, fromId: number, toId: number) => {
    try {
      const res = await api.moveProject(pid, fromId, toId)
      if (res.data.code === 0) {
        const formG = allGroups.value.find(m => m.id === fromId)
        const toG = allGroups.value.find(m => m.id === toId)
        if (formG && toG) {
          const idx = formG.children.findIndex(m => m.id === pid)
          const p = formG.children.splice(idx, 1)[0]
          p.groupId = toId
          toG.children.push(p)
        }
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const copyProject = async (gid: number, pid: number) => {
    try {
      const res = await api.copyProject(pid)
      if (res.data.code === 0) {
        const g = allGroups.value.find(m => m.id === gid)
        if (g) {
          // TODO: 这里只是简单 cloneDeep，实际应该在后端完成
          const p = g.children.find(m => m.id === pid)!
          const copy_p = _.cloneDeep(p)
          copy_p.id = Math.round(Math.random() * 1000)
          copy_p.name += '_copy'
          g.children.push(copy_p)
        }
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const createProjectGroup = async (name: string) => {
    try {
      const { data } = await api.createProjectGroup({ name })
      if (data.code === 0) {
        const newGroup = new ProjectGroup(data.data, name, [])
        newGroup.type = ProjectGroupType.group
        allGroups.value.unshift(newGroup)
      } else {
        throw Error(data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const deleteProjectGroup = async (id: number) => {
    try {
      const res = await api.deleteProjectGroup(id)
      if (res.data.code === 0) {
        const idx = allGroups.value.findIndex(m => m.id === id)
        const ungroup = allGroups.value.find(m => m.type === ProjectGroupType.ungroup)
        if (idx > -1 && ungroup) {
          const [group] = allGroups.value.splice(idx, 1)
          group.children.forEach(item => {
            item.groupId = ungroup.id
            ungroup.children.push(item)
          })
        }
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  return {
    group,
    ungroup,
    groups,
    getProjects,
    deleteProject,
    moveProject,
    copyProject,
    createProjectGroup,
    deleteProjectGroup,
  }
}
