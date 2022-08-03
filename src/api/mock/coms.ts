import Mock from 'mockjs'
import type MockAdapter from 'axios-mock-adapter'

export default (adapter: MockAdapter) => {
  // 组件列表
  adapter.onGet('/coms')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
      data: [
        {
          id: '@guid',
          type: 'com',
          alias: '通用标题',
          name: 'VMainTitle',
          locked: false,
          parentId: null,
          hided: false,
          attr: {
            opacity: 1,
            'x|100-1500': 810,
            w: 300,
            'y|100-600': 512,
            deg: 0,
            'h|56-300': 56,
            filpV: false,
            filpH: false,
          },
          icon: 'v-icon-title',
          config: {
            title: '我是标题',
            textStyle: {
              fontFamily: 'Microsoft Yahei',
              fontSize: 24,
              color: '#fff',
              fontWeight: 'normal',
            },
            textAlign: 'center',
            urlConfig: {
              url: '',
              isBlank: false,
            },
            writingMode: 'horizontal-tb',
            letterSpacing: 0,
            ellipsis: false,
            backgroundStyle: {
              show: false,
              bgColor: '#008bff',
              borderRadius: 15,
              borderColor: '#fff',
              borderStyle: 'solid',
              borderWidth: 1,
            },
          },
          children: null,
          img: '//files.pengxiaotian.com/com-thum/main-title-370-208.png',
          apis: {
            source: {
              autoUpdate: 1,
              description: '',
              fields: {
                title: {
                  type: 'string',
                  path: '',
                  map: '',
                  description: '标题值',
                  optional: true,
                },
                url: {
                  type: 'string',
                  path: '',
                  map: '',
                  description: '超链接',
                  optional: true,
                },
              },
              handler: 'render',
              useAutoUpdate: false,
            },
          },
          apiData: {
            source: {
              id: '@guid',
              type: 'static',
              comId: '@guid',
              config: {
                useFilter: false,
                pageFilters: [],
                data: '{"title":"我是标题数据","url":""}',
              },
              pageFilters: [],
            },
          },
          projectId: 1,
          events: [],
          selected: false,
          hovered: false,
        },
      ],
    }))

  // 创建
  adapter.onPost('/coms')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 复制组件
  adapter.onPost(/\/coms\/\S+\/copy$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  // 删除组件
  adapter.onDelete(/\/coms\/\S+$/)
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))

  adapter.onDelete('/coms/some')
    .reply(200, Mock.mock({
      code: 0,
      message: 'ok',
    }))
}
