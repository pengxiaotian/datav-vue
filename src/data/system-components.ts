export const bar = {
  type: 'bar',
  name: '柱状图',
  icon: 'v-icon-chart-bar',
  data: [
    {
      name: 'VBasicBar',
      alias: '柱状图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-bar-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/basic-bar-368-208.png`,
      used: true,
    }, {
      name: 'VArcBar',
      alias: '玉环图',
      img: `${import.meta.env.VITE_APP_CDN}/com/arc-bar-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/arc-bar-368-208.png`,
      used: false,
    }, {
      name: 'VLineBarChart',
      alias: '折线柱图',
      img: `${import.meta.env.VITE_APP_CDN}/com/line-bar-chart-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/line-bar-chart-368-208.png`,
      used: false,
    }, {
      name: 'VBarWithLine',
      alias: '折线柱图(多)',
      img: `${import.meta.env.VITE_APP_CDN}/com/bar-with-line.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com/bar-with-line.png`,
      used: false,
    },
  ],
}

export const horizontalBar = {
  type: 'horizontal-bar',
  name: '条形图',
  icon: 'v-icon-chart-bar',
  data: [
    {
      name: 'VHoriBasicBar',
      alias: '水平基本柱状图',
      img: `${import.meta.env.VITE_APP_CDN}/com/hori-basic-bar-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/hori-basic-bar-368-208.png`,
      used: false,
    },
  ],
}

export const line = {
  type: 'line',
  name: '折线图',
  icon: 'v-icon-chart-line',
  data: [
    {
      name: 'VBasicLine',
      alias: '基本折线图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-line-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/basic-line-368-208.png`,
      used: false,
    },
  ],
}

export const area = {
  type: 'area',
  name: '区域图',
  icon: 'v-icon-chart-line',
  data: [
    {
      name: 'VBasicArea',
      alias: '区域图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-area-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/basic-area-368-208.png`,
      used: false,
    },
  ],
}

export const pie = {
  type: 'pie',
  name: '饼环图',
  icon: 'v-icon-chart-pie',
  data: [
    {
      name: 'VBasicPie',
      alias: '基本饼图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-pie-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/basic-pie-368-208.png`,
      used: false,
    }, {
      name: 'VPieOneValue',
      alias: '指标占比饼图',
      img: `${import.meta.env.VITE_APP_CDN}/com/pie-one-value-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/pie-one-value-368-208.png`,
      used: false,
    },
  ],
}

export const relation = {
  type: 'relation',
  name: '关系图',
  icon: 'v-icon-relation',
  data: [
    {
      name: 'VTree',
      alias: '树图',
      img: `${import.meta.env.VITE_APP_CDN}/com/tree.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com/tree.png`,
      used: false,
    },
  ],
}

export const chart = {
  type: 'chart',
  name: '其他',
  icon: 'v-icon-other',
  data: [
    {
      name: 'VWordCloud',
      alias: '词云',
      img: `${import.meta.env.VITE_APP_CDN}/com/word-cloud-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/word-cloud-370-208.png`,
      used: false,
    },
  ],
}

export const map = {
  type: 'map',
  name: '地图',
  icon: 'v-icon-map',
  data: [
    {
      name: 'VChina2d',
      alias: '基础平面地图',
      img: `${import.meta.env.VITE_APP_CDN}/com/2d-china-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/2d-china-368-208.png`,
      used: false,
      children: [
        {
          name: 'VChina2dBubbles',
          alias: '呼吸气泡层',
          img: `${import.meta.env.VITE_APP_CDN}/com/2d-china-bubbles-180-180.png`,
          thum: `${import.meta.env.VITE_APP_CDN}/com/2d-china-bubbles-180-180.png`,
          used: false,
        }, {
          name: 'VChina2dFlyLines',
          alias: '飞线层',
          img: `${import.meta.env.VITE_APP_CDN}/com/2d-china-fly-lines-180-180.png`,
          thum: `${import.meta.env.VITE_APP_CDN}/com/2d-china-fly-lines-180-180.png`,
          used: false,
        },
      ],
    }, {
      name: 'VWorld3d',
      alias: '3D平面世界地图',
      img: `${import.meta.env.VITE_APP_CDN}/com/3d-world-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/3d-world-368-208.png`,
      used: false,
    },
  ],
}

export const title = {
  type: 'title',
  name: '标题',
  icon: 'v-icon-title',
  data: [
    {
      name: 'VMainTitle',
      alias: '通用标题',
      img: `${import.meta.env.VITE_APP_CDN}/com/main-title-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/main-title-370-208.png`,
      used: true,
    }, {
      name: 'VMarquee',
      alias: '跑马灯',
      img: `${import.meta.env.VITE_APP_CDN}/com/marquee-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/marquee-370-208.png`,
      used: true,
    }, {
      name: 'VNumberTitleFlop',
      alias: '数字翻牌器',
      img: `${import.meta.env.VITE_APP_CDN}/com/number-title-flop-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/number-title-flop-370-208.png`,
      used: true,
    }, {
      name: 'VParagraph',
      alias: '多行文本',
      img: `${import.meta.env.VITE_APP_CDN}/com/paragraph-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/paragraph-370-208.png`,
      used: true,
    }, {
      name: 'VTimer',
      alias: '时间器',
      img: `${import.meta.env.VITE_APP_CDN}/com/timer-160-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/timer-370-208.png`,
      used: true,
    },
  ],
}

export const list = {
  type: 'list',
  name: '列表',
  icon: 'v-icon-view-list',
  data: [
    {
      name: 'VCarouselTable',
      alias: '轮播列表',
      img: `${import.meta.env.VITE_APP_CDN}/com/carousel-table-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/carousel-table-370-208.png`,
      used: false,
    }, {
      name: 'VTableBar',
      alias: '轮播列表柱状图',
      img: `${import.meta.env.VITE_APP_CDN}/com/table-bar-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/table-bar-370-208.png`,
      used: false,
    },
  ],
}

export const button = {
  type: 'button',
  name: '按钮类',
  icon: 'v-icon-interact',
  data: [
    {
      name: 'VFullScreen',
      alias: '全屏切换',
      img: `${import.meta.env.VITE_APP_CDN}/com/full-screen-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/full-screen-368-208.png`,
      used: false,
    },
  ],
}

export const select = {
  type: 'select',
  name: '选择类',
  icon: 'v-icon-interact',
  data: [
    {
      name: 'VTabList',
      alias: 'Tab列表',
      img: `${import.meta.env.VITE_APP_CDN}/com/tab-list-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/tab-list-368-208.png`,
      used: false,
    },
  ],
}

export const interactData = {
  type: 'interact-data',
  name: '数据类',
  icon: 'v-icon-interact',
  data: [
    {
      name: 'VPercentageBar',
      alias: '进度条',
      img: `${import.meta.env.VITE_APP_CDN}/com/percentage-bar-332-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/percentage-bar-370-208.png`,
      used: false,
    },
  ],
}

export const material = {
  type: 'material',
  name: '素材',
  icon: 'v-icon-material',
  data: [
    {
      name: 'VBgBox',
      alias: '自定义背景块',
      img: `${import.meta.env.VITE_APP_CDN}/com/bg-box-334-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/bg-box-370-208.png`,
      used: true,
    }, {
      name: 'VBorderBox',
      alias: '边框',
      img: `${import.meta.env.VITE_APP_CDN}/com/border-box-162-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/border-box-370-208.png`,
      used: true,
    }, {
      name: 'VDecoration',
      alias: '装饰',
      img: `${import.meta.env.VITE_APP_CDN}/com/decoration-162-116.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/decoration-370-208.png`,
      used: true,
    }, {
      name: 'VMainImg',
      alias: '单张图片',
      img: `${import.meta.env.VITE_APP_CDN}/com/main-img-334-144.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/main-img-370-208.png`,
      used: false,
    },
  ],
}

export const other = {
  type: 'other',
  name: '其他',
  icon: 'v-icon-other',
  data: [
    {
      name: 'VDatePicker',
      alias: '日期选择器',
      img: `${import.meta.env.VITE_APP_CDN}/com/date-picker.jpg`,
      thum: `${import.meta.env.VITE_APP_CDN}/com-thum/time-selector.jpg`,
      used: true,
    }, {
      name: 'VTabSelect',
      alias: 'Tab选择器',
      img: `${import.meta.env.VITE_APP_CDN}/com/tab-select.png`,
      thum: `${import.meta.env.VITE_APP_CDN}/com/tab-select.png`,
      used: false,
    },
  ],
}

export const classifications = [
  {
    type: 'regular',
    name: '图表',
    icon: 'v-icon-chart',
    data: [bar, horizontalBar, line, area, pie, relation, chart],
  },
  {
    type: 'map',
    name: '地图',
    icon: 'v-icon-map',
    data: [map],
  },
  {
    type: 'text',
    name: '信息',
    icon: 'v-icon-com-info',
    data: [title],
  },
  {
    type: 'table',
    name: '表格',
    icon: 'v-icon-table',
    data: [list],
  },
  {
    type: 'interact',
    name: '交互',
    icon: 'v-icon-interact',
    data: [button, select, interactData],
  },
  {
    type: 'media',
    name: '媒体',
    icon: 'v-icon-media',
    data: [material],
  },
  {
    type: 'other',
    name: '其他',
    icon: 'v-icon-other',
    data: [other],
  },
]

export function findComByName(name: string) {
  for (let i = 0; i < classifications.length; i++) {
    const classification = classifications[i]
    for (let j = 0; j < classification.data.length; j++) {
      const category = classification.data[j]
      const com = category.data.find(m => m.name === name)
      if (com) {
        return {
          classification,
          category,
          com,
        }
      }
    }
  }

  return null
}
