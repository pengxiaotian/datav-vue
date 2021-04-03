import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import _ from 'lodash'
import store from '@/store'
import { Project, ProjectConfig } from '@/domains/project'
import { getComs, deleteCom, addCom, copyCom } from '@/api/coms'
import { getProject } from '@/api/project'
import { ComType, MoveType } from '@/domains/enums/com-enums'
import { generateShortId } from '@/utils/util'
import { BaseComponent } from '@/domains/base-component'

config.rawError = true

/* region interfaces */

export type Screen = Pick<Project, 'id' | 'name'>

interface MoveComDto {
  id: string
  moveType: MoveType
}

export interface IEditorState {
  screen: Screen
  pageConfig: ProjectConfig
  coms: BaseComponent[]
  subComs: BaseComponent[]
  contextMenu: {
    show: boolean
  }
}

/* endregion */

const findComIndex = (coms: BaseComponent[], id: string) => {
  return coms.findIndex(c => c.id === id)
}

const findCom = (coms: BaseComponent[], id: string) => {
  return coms.find(c => c.id === id)
}

const findComs = (coms: BaseComponent[], parentId?: string) => {
  return coms.filter(c => c.parentId === parentId)
}

@Module({ dynamic: true, store, name: 'editor' })
class Editor extends VuexModule implements IEditorState {
  public screen = {
    id: 0,
    name: '',
  }

  public pageConfig: ProjectConfig = {
    width: 1920,
    height: 1080,
    bgimage: '',
    bgcolor: '',
    grid: 8,
    screenshot: '',
    zoomMode: 0,
    useWatermark: false,
  }

  coms: BaseComponent[] = [];
  subComs: BaseComponent[] = [];

  contextMenu = {
    show: false,
  }

  public get selectedCom() {
    return this.coms.find(m => m.selected)
  }

  @Mutation
  private SET_SCREEN(payload: Project) {
    this.screen = {
      id: payload.id,
      name: payload.name,
    }

    this.pageConfig = { ...payload.config }
  }

  @Mutation
  private SET_COMS(payload: BaseComponent[]) {
    const coms: BaseComponent[] = []
    const subComs: BaseComponent[] = []
    payload.forEach(c => {
      if (c.type === ComType.com) {
        coms.push(c)
      } else if (c.type === ComType.subCom) {
        subComs.push(c)
      }
    })

    this.coms = coms
    this.subComs = subComs
  }

  @Mutation
  public MOVE_COM_ZINDEX({ id, moveType }: MoveComDto) {
    const i = findComIndex(this.coms, id)
    if (moveType === MoveType.up) {
      if (i + 1 < this.coms.length) {
        this.coms.splice(i + 1, 0, ...this.coms.splice(i, 1))
      }
    } else if (moveType === MoveType.down) {
      if (i > 0) {
        this.coms.splice(i - 1, 0, ...this.coms.splice(i, 1))
      }
    } else if (moveType === MoveType.top) {
      if (i + 1 < this.coms.length) {
        this.coms.push(...this.coms.splice(i, 1))
      }
    } else if (moveType === MoveType.bottom) {
      if (i > 0) {
        this.coms.unshift(...this.coms.splice(i, 1))
      }
    }
  }

  @Mutation
  private DELETE_COM(com: BaseComponent) {
    if (com.type === ComType.com) {
      this.coms.splice(findComIndex(this.coms, com.id), 1)
    } else {
      this.subComs.splice(findComIndex(this.subComs, com.id), 1)
    }
  }

  @Mutation
  private ADD_COM(id: string) {
    const com = findCom(this.coms, id)
    console.log(com)
  }

  @Mutation
  private COPY_COM(id: string) {
    // 模拟后端复制
    const getNewCom = (com: BaseComponent, parentId?: string) => {
      const ncom = _.cloneDeep(com)
      ncom.id = generateShortId(ncom.name)
      ncom.alias += '_copy'
      ncom.attr.x += 30
      ncom.attr.y += 30

      ncom.hovered = false
      ncom.selected = false
      ncom.renameing = false

      ncom.parentId = parentId

      for (const key in ncom.source) {
        ncom.source[key].id = generateShortId()
        ncom.source[key].comId = ncom.id
      }

      return ncom
    }

    const ocom = findCom(this.coms, id)
    if (ocom) {
      const ncom = getNewCom(ocom)
      const nSubComs = findComs(this.subComs, ocom.id).map(m => getNewCom(m, ncom.id))
      this.coms.push(ncom)
      this.subComs.push(...nSubComs)
    }
  }

  @Action
  public async loadScreen(projectId: number) {
    try {
      const res = await getProject(projectId)
      if (res.data.code === 0) {
        this.SET_SCREEN(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async loadComs(projectId: number) {
    try {
      const res = await getComs(projectId)
      if (res.data.code === 0) {
        this.SET_COMS(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async deleteCom(com: BaseComponent) {
    try {
      const res = await deleteCom(com.id)
      if (res.data.code === 0) {
        this.DELETE_COM(com)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async addCom(id: string) {
    try {
      const res = await addCom(id)
      if (res.data.code === 0) {
        this.ADD_COM(id)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async copyCom(id: string) {
    try {
      const res = await copyCom(id)
      if (res.data.code === 0) {
        this.COPY_COM(id)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }
}

export const EditorModule = getModule(Editor)
