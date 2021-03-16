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
      allGroups.value = res.data.data
    } else {
      throw Error(res.data.message)
    }
  } catch (error) {
    throw error
  }
}

export const ProjectStore = () => {

  const ungroup = computed(() => {
    const group = new ProjectGroup()
    const g = allGroups.value.find(m => m.type === ProjectGroupType.ungroup)
    group.children = g ? g.children : []
    return group
  })

  const groups = computed(() => {
    return allGroups.value.filter(m => m.type === ProjectGroupType.group)
  })

  const projects = computed(() => {
    return allGroups.value.flatMap(m => m.children)
  })

  onMounted(() => {
    getProjects()
  })

  return {
    ungroup,
    groups,
    projects,
    getProjects,
  }
}
