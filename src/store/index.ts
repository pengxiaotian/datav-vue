import { createStore } from 'vuex'
import { IUserState } from './modules/user'
import { IToolbarState } from './modules/toolbar'
// -- prepend import placeholder --

// The name field in the decorator should match
// the actual name that you will assign the IRootState to,
// when you create the store.
export interface IRootState {
  user: IUserState
  toolbar: IToolbarState
  // -- prepend state placeholder --
}

// Declare empty store first,
// dynamically register all modules later.
export default createStore<IRootState>({})
