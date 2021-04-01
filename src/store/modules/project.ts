import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import _ from 'lodash'
import { ProjectGroupType, ProjectGroup } from '@/domains/project'
import * as api from '@/api/project'

config.rawError = true

/* region interfaces */

export interface IProjectState {
  allGroups: ProjectGroup[]
}

/* endregion */

@Module({ dynamic: true, store, name: 'project' })
class Project extends VuexModule implements IProjectState {
  public allGroups: ProjectGroup[] = []

  public get group() {
    const list = this.allGroups.flatMap(m => m.children)
    return new ProjectGroup(-1, '全部应用', list)
  }

  public get ungroup() {
    const g = this.allGroups.find(m => m.type === ProjectGroupType.ungroup)
    return g ? g : new ProjectGroup(0, '未分组', [])
  }

  public get groups() {
    return this.allGroups.filter(m => m.type === ProjectGroupType.group)
  }

  @Mutation
  private SET_PROJECTS(payload: ProjectGroup[]) {
    this.allGroups = payload
  }

  @Mutation
  private DELETE_PROJECT(payload: { pid: number; gid: number; }) {
    const g = this.allGroups.find(m => m.id === payload.gid)
    if (g) {
      g.children = g.children.filter(m => m.id !== payload.pid)
    }
  }

  @Mutation
  private UPDATE_PROJECT_NAME(payload: { id: number; newName: string; }) {
    const g = this.allGroups.find(m => m.id === payload.id)
    if (g) {
      g.name = payload.newName
    }
  }

  @Mutation
  private MOVE_PROJECT(payload: { pid: number; fromId: number; toId: number; }) {
    const { pid, fromId, toId } = payload
    const formG = this.allGroups.find(m => m.id === fromId)
    const toG = this.allGroups.find(m => m.id === toId)
    if (formG && toG) {
      const idx = formG.children.findIndex(m => m.id === pid)
      const p = formG.children.splice(idx, 1)[0]
      p.groupId = toId
      toG.children.push(p)
    }
  }

  @Mutation
  private COPY_PROJECT(payload: { pid: number; gid: number; }) {
    const g = this.allGroups.find(m => m.id === payload.gid)
    if (g) {
      // TODO: 这里只是简单 cloneDeep，实际应该在后端完成
      const p = g.children.find(m => m.id === payload.pid)!
      const copy_p = _.cloneDeep(p)
      copy_p.id = Math.round(Math.random() * 1000)
      copy_p.name += '_copy'
      g.children.push(copy_p)
    }
  }

  @Mutation
  private CREATE_PROJECT_GROUP(payload: { id: number; name: string; }) {
    const newGroup = new ProjectGroup(payload.id, payload.name, [])
    newGroup.type = ProjectGroupType.group
    this.allGroups.unshift(newGroup)
  }

  @Mutation
  private DELETE_PROJECT_GROUP(id: number) {
    const idx = this.allGroups.findIndex(m => m.id === id)
    const ungroup = this.allGroups.find(m => m.type === ProjectGroupType.ungroup)
    if (idx > -1 && ungroup) {
      const [group] = this.allGroups.splice(idx, 1)
      group.children.forEach(item => {
        item.groupId = ungroup.id
        ungroup.children.push(item)
      })
    }
  }

  @Action
  public async getProjects() {
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

        this.SET_PROJECTS([ungroup, ...list.filter(m => m.type === ProjectGroupType.group)])
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async deleteProject(payload: { pid: number; gid: number; }) {
    try {
      const res = await api.deleteProject(payload.pid)
      if (res.data.code === 0) {
        this.DELETE_PROJECT(payload)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async updateProjectName(payload: { id: number; newName: string; }) {
    try {
      const res = await api.updateProjectName(payload.id, payload.newName)
      if (res.data.code !== 0) {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async moveProject(payload: { pid: number; fromId: number; toId: number; }) {
    try {
      const { pid, fromId, toId } = payload
      const res = await api.moveProject(pid, fromId, toId)
      if (res.data.code === 0) {
        this.MOVE_PROJECT(payload)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async copyProject(payload: { pid: number; gid: number; }) {
    try {
      const res = await api.copyProject(payload.pid)
      if (res.data.code === 0) {
        this.COPY_PROJECT(payload)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async createProjectGroup(name: string) {
    try {
      const { data } = await api.createProjectGroup({ name })
      if (data.code === 0) {
        this.CREATE_PROJECT_GROUP({ id: data.data, name })
      } else {
        throw Error(data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async deleteProjectGroup(id: number) {
    try {
      const res = await api.deleteProjectGroup(id)
      if (res.data.code === 0) {
        this.DELETE_PROJECT_GROUP(id)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async updateProjectGroupName(payload: { id: number; newName: string; }) {
    try {
      const res = await api.updateProjectGroupName(payload.id, payload.newName)
      if (res.data.code !== 0) {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }
}

export const ProjectModule = getModule(Project)
