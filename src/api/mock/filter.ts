import Mock from 'mockjs'
import type MockAdapter from 'axios-mock-adapter'

export default (adapter: MockAdapter) => {
  // 过滤器列表
  adapter.onGet('/filter')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      'data|2': [
        {
          'id|1-100000': 1,
          name: '新建过滤器',
          code: 'if (!data) { return data; }  return filter(data);  function filter(data){  return data;   }',
          origin: 'return data',
          projectId: 0,
          createAt: '@datetime',
          updateAt: '@now',
        },
      ],
    }))

  // 创建
  adapter.onPost('/filter')
    .reply(() => [200, Mock.mock({
      code: 0,
      message: 'ok',
      'data|1-100000': 1,
    })])

  // 修改过滤器
  adapter.onPut(/\/filter\/\d+/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 修改名称
  adapter.onPut(/\/filter\/\d+\/name/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 删除
  adapter.onDelete(/\/filter\/\d+/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))
}
