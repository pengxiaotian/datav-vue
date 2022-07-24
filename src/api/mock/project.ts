import Mock from 'mockjs'
import type MockAdapter from 'axios-mock-adapter'

export default (adapter: MockAdapter) => {
  // 项目列表
  adapter.onGet('/project')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      'data|1-3': [
        {
          'id|1-10000': 0,
          name: '@word',
          'children|1-3': [
            {
              'id|100-10000': 1,
              name: '@word',
              'share|0-1': '@url',
              groupId: 0,
              'thumbnail|0-1': '//files.pengxiaotian.com/datav/bj.png',
              config: {},
              createAt: '@datetime',
              updateAt: '@datetime',
            },
          ],
          'type|0-1': 1,
        },
      ],
    }))

  // 新建项目
  adapter.onPost('/project')
    .reply(() => {
      return [200, Mock.mock({
        code: 0,
        message: 'ok',
        'data|100-10000': 1,
      })]
    })

  // 修改项目名称
  adapter.onPut(/\/project\/\d+\/name$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 项目基本信息
  adapter.onGet(/\/project\/\d+$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      data: {
        id: 1,
        name: '@word',
        config: {
          bgcolor: 'rgba(13,42,67,0)',
          width: 1920,
          height: 1080,
          bgimage: '//files.pengxiaotian.com/datav/bj.png',
          screenshot: '',
          zoomMode: 1,
          useWatermark: true,
          grid: 8,
          styleFilterParams: {
            enable: false,
            hue: 0,
            saturate: 100,
            brightness: 100,
            contrast: 100,
            opacity: 100,
          },
          variables: {
            componentsView: {},
            publishersView: {},
            subscribersView: {},
          },
        },
        'share|0-1': '@url',
        thumbnail: '',
        groupId: 0,
        createAt: '@datetime',
        updateAt: '@datetime',
      },
    }))

  // 删除项目
  adapter.onDelete(/\/project\/\d+$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 新建分组
  adapter.onPost('/project/group')
    .reply(() => {
      return [200, Mock.mock({
        code: 0,
        message: 'ok',
        'data|1-10000': 1,
      })]
    })

  // 删除组
  adapter.onDelete(/\/project\/group\/\d+$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 修改组名称
  adapter.onPut(/\/project\/group\/\d+\/name$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 修改组
  adapter.onPut(/\/project\/\d+\/group$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 复制项目
  adapter.onPost(/\/project\/\d+\/copy$/)
    .reply(() => {
      return [200, Mock.mock({
        code: 0,
        message: 'ok',
        'data|1-10000': 1,
      })]
    })

  // 项目模板
  adapter.onGet('/project/template')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      'data|1-20': [
        {
          'id|0-10000': 1,
          name: '@word',
          description: '模板的描述',
          size: [
            '比例 16:9',
            '1920x1080px',
          ],
          'snapshot|0-1': '//img.alicdn.com/tfs/TB1HGKHH.z1gK0jSZLeXXb9kVXa-1600-900.gif',
          'thumbnail|0-1': '//gw.alicdn.com/tfs/TB1lY6WHWL7gK0jSZFBXXXZZpXa-280-158.png',
        },
      ],
    }))

  // 获取发布信息
  adapter.onGet(/\/project\/\d+\/publish$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      data: {
        'share|0-1': '@url',
        'password|0-1': '@word',
      },
    }))

  // 发布
  adapter.onPost(/\/project\/\d+\/publish$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))
}
