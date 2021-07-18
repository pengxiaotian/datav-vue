import Mock from 'mockjs'
import type MockAdapter from 'axios-mock-adapter'

export default (adapter: MockAdapter) => {
  adapter.onPost('/user/login')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      'data|30': '',
    }))

  adapter.onPost('/user/logout')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  adapter.onGet('/user/info')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      data: {
        name: '美人骨',
        avatar: '//files.pengxiaotian.com/avatar.jpeg',
        role: 1,
      },
    }))
}
