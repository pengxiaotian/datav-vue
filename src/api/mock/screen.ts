import Mock from 'mockjs'
import adapter from '@/utils/mock-adapter'

// 保存大屏
adapter.onGet('/screen')
  .reply(200, Mock.mock({
    'code': 0,
    'message': 'ok',
  }))

// 保存大屏
adapter.onPost('/screen')
  .reply(200, Mock.mock({
    'code': 0,
    'message': 'ok',
  }))
