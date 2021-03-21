import { ref, computed, onMounted } from 'vue'
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


export const ProjectStore = () => {
  const allGroups = ref<ProjectGroup[]>([])

  const group = computed(() => {
    const list = allGroups.value.flatMap(m => m.children)
    return new ProjectGroup(-1, '全部应用', list)
  })

  const ungroup = computed(() => {
    const list = allGroups.value.filter(m => m.type === ProjectGroupType.ungroup)
    return new ProjectGroup(0, '未分组', list.flatMap(m => m.children))
  })

  const groups = computed(() => {
    return allGroups.value.filter(m => m.type === ProjectGroupType.group)
  })

  const getProjects = async () => {
    try {
      const res = await api.getProjects()
      if (res.data.code === 0) {
        const list = res.data.data || []

        // TODO: 如果用关系数据库就不用赋值 groupId
        list.forEach((item: any) => {
          item.children.forEach((subitem: any) => {
            subitem.groupId = item.id
          })
        })

        allGroups.value = list
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
        throw Error(res.data)
      }
    } catch (error) {
      throw error
    }
  }

  onMounted(() => {
    getProjects()
  })

  return {
    group,
    ungroup,
    groups,
    getProjects,
    deleteProject,
  }
}
