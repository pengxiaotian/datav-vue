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

const allGroups = ref<ProjectGroup[]>([])

const getProjects = async () => {
  try {
    const res = await api.getProjects()
    if (res.data.code === 0) {
      allGroups.value = res.data.data || []
    } else {
      throw Error(res.data.message)
    }
  } catch (error) {
    throw error
  }
}

export const ProjectStore = () => {

  const group = computed(() => {
    const list = allGroups.value.flatMap(m => m.children)
    return new ProjectGroup(-1, '全部应用', list)
  })

  const ungroup = computed(() => {
    const g = allGroups.value.find(m => m.type === ProjectGroupType.ungroup)
    return new ProjectGroup(0, '未分组', g ? g.children || [] : [])
  })

  const groups = computed(() => {
    return allGroups.value.filter(m => m.type === ProjectGroupType.group)
  })

  onMounted(() => {
    getProjects()
  })

  return {
    group,
    ungroup,
    groups,
    getProjects,
  }
}
