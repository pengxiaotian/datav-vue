import type MockAdapter from 'axios-mock-adapter'

import mockUser from './user'
import mockProject from './project'
import mockComs from './coms'
import mockFilter from './filter'
import mockQiniu from './qiniu'
import mockScreen from './screen'

export default (adapter: MockAdapter) => {
  mockUser(adapter)
  mockProject(adapter)
  mockComs(adapter)
  mockFilter(adapter)
  mockQiniu(adapter)
  mockScreen(adapter)
}
