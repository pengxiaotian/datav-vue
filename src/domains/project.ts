export enum ProjectGroupType {
  ungroup = 0,
  group = 1
}

export interface ProjectConfig {
  width: number
  height: number
  bgcolor: string
  bgimage: string
  grid: number
  screenshot: string
  zoomMode: number
  useWatermark: boolean
}

export interface StyleFilter {
  enable: boolean
  hue: number
  saturate: number
  brightness: number
  contrast: number
  opacity: number
}

export interface Project {
  id: number
  name: string
  share: string
  groupId: number
  config: ProjectConfig
  styleFilterParams: StyleFilter
  createAt: string
  updateAt: string
}

export class ProjectGroup {
  id: number
  name: string
  type: ProjectGroupType
  children: Project[]

  editing?: boolean

  constructor(id = 0, name = '', children: Project[] = []) {
    this.id = id
    this.name = name
    this.children = children
    this.type = ProjectGroupType.ungroup
  }
}

export interface ProjectTemplate {
  id: number
  name: string
  size: String[]
  snapshot: string
  thumbnail: string
}
