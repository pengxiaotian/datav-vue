import { createStore } from 'vuex'
import { IToolbarState } from './modules/toolbar'
import { IEditorState } from './modules/editor'
import { IProjectState } from './modules/project'
// -- prepend import placeholder --

// The name field in the decorator should match
// the actual name that you will assign the IRootState to,
// when you create the store.
export interface IRootState {
  toolbar: IToolbarState
  editor: IEditorState
  project: IProjectState
  // -- prepend state placeholder --
}

// Declare empty store first,
// dynamically register all modules later.
export default createStore<IRootState>({})
