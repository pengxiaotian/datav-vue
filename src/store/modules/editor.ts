import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { ProjectConfig } from '@/domains/project.entity'
import { BaseComponent } from '@/domains/base-component'
import { getComs } from '@/api/coms'
import { ComType } from '@/domains/enums/com-type'

config.rawError = true

/* region interfaces */

export interface IEditorState {
  pageConfig: ProjectConfig
  coms: BaseComponent[]
  subComs: BaseComponent[]
}

/* endregion */

@Module({ dynamic: true, store, name: 'editor' })
class Editor extends VuexModule implements IEditorState {
  pageConfig: ProjectConfig = {
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

  @Mutation
  private LOAD_COMS(payload: BaseComponent[]) {
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

  @Action
  public async loadComs(projectId: number) {
    try {
      const res = await getComs(projectId)
      if (res.data.code === 0) {
        this.LOAD_COMS(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }
}

export const EditorModule = getModule(Editor)
