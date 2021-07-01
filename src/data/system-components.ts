export const bar = {
  type: 'bar',
  name: '柱图',
  icon: 'v-icon-chart-bar',
  data: [
    {
      name: 'VBasicBar',
      alias: '基本柱状图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-bar.png`,
      used: true,
    }, {
      name: 'VArcBar',
      alias: '弧形柱图',
      img: `${import.meta.env.VITE_APP_CDN}/com/arc-bar.png`,
      used: true,
    }, {
      name: 'VBarWithLine',
      alias: '折线柱图(多)',
      img: `${import.meta.env.VITE_APP_CDN}/com/bar-with-line.png`,
      used: true,
    }, {
      name: 'VLineBarChart',
      alias: '折线柱图',
      img: `${import.meta.env.VITE_APP_CDN}/com/line-bar-chart.png`,
      used: true,
    }, {
      name: 'VHoriBasicBar',
      alias: '水平基本柱状图',
      img: `${import.meta.env.VITE_APP_CDN}/com/hori-basic-bar.png`,
      used: true,
    },
  ],
}

export const line = {
  type: 'line',
  name: '折线',
  icon: 'v-icon-chart-line',
  data: [
    {
      name: 'VBasicLine',
      alias: '基本折线图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-line.png`,
      used: true,
    }, {
      name: 'VBasicArea',
      alias: '区域图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-area.png`,
      used: true,
    },
  ],
}

export const pie = {
  type: 'pie',
  name: '饼图',
  icon: 'v-icon-chart-pie',
  data: [
    {
      name: 'VBasicPie',
      alias: '基本饼图',
      img: `${import.meta.env.VITE_APP_CDN}/com/basic-pie.png`,
      used: true,
    }, {
      name: 'VPieOneValue',
      alias: '指标占比图',
      img: `${import.meta.env.VITE_APP_CDN}/com/pie-one-value.png`,
      used: true,
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
      img: `${import.meta.env.VITE_APP_CDN}/com/2d-china.png`,
      used: true,
      children: [
        {
          name: 'VChina2dEffectScatter',
          alias: '动态气泡层',
          img: `${import.meta.env.VITE_APP_CDN}/com/2d-china.png`,
          used: true,
        }, {
          name: 'VChina2dFlyLines',
          alias: '飞线层',
          img: `${import.meta.env.VITE_APP_CDN}/com/2d-china.png`,
          used: true,
        },
      ],
    }, {
      name: 'VBasicLine',
      alias: '世界',
      img: `${import.meta.env.VITE_APP_CDN}/com/3d-world.png`,
      used: false,
    },
  ],
}

export const img = {
  type: 'img',
  name: '图片',
  icon: 'v-icon-img',
  data: [
    {
      name: 'VMainImg',
      alias: '单张图片',
      img: `${import.meta.env.VITE_APP_CDN}/com/main-img.png`,
      used: true,
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
      img: `${import.meta.env.VITE_APP_CDN}/com/main-title.png`,
      used: true,
    }, {
      name: 'VMarquee',
      alias: '跑马灯',
      img: `${import.meta.env.VITE_APP_CDN}/com/marquee.png`,
      used: true,
    }, {
      name: 'VWordCloud',
      alias: '词云',
      img: `${import.meta.env.VITE_APP_CDN}/com/word-cloud.png`,
      used: true,
    }, {
      name: 'VNumberTitleFlop',
      alias: '数字翻牌器',
      img: `${import.meta.env.VITE_APP_CDN}/com/number-title-flop.png`,
      used: true,
    }, {
      name: 'VParagraph',
      alias: '多行文本',
      img: `${import.meta.env.VITE_APP_CDN}/com/paragraph.png`,
      used: true,
    }, {
      name: 'VPercentageBar',
      alias: '进度条',
      img: `${import.meta.env.VITE_APP_CDN}/com/percentage-bar.png`,
      used: true,
    }, {
      name: 'VTimer',
      alias: '时间器',
      img: `${import.meta.env.VITE_APP_CDN}/com/timer.png`,
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
      img: `${import.meta.env.VITE_APP_CDN}/com/carousel-table.png`,
      used: true,
    }, {
      name: 'VTableBar',
      alias: '轮播列表柱状图',
      img: `${import.meta.env.VITE_APP_CDN}/com/table-bar.png`,
      used: true,
    },
  ],
}

export const relation = {
  type: 'relation',
  name: '关系',
  icon: 'v-icon-relation',
  data: [
    {
      name: 'VTree',
      alias: '树图',
      img: `${import.meta.env.VITE_APP_CDN}/com/tree.png`,
      used: true,
    },
  ],
}

export const material = {
  type: 'material',
  name: '素材',
  icon: 'v-icon-material',
  data: [
    {
      name: 'VDecoration',
      alias: '装饰',
      img: `${import.meta.env.VITE_APP_CDN}/com/decoration.png`,
      used: true,
    }, {
      name: 'VBorderBox',
      alias: '边框',
      img: `${import.meta.env.VITE_APP_CDN}/com/border-box.png`,
      used: true,
    }, {
      name: 'VBGBox',
      alias: '自定义背景',
      img: `${import.meta.env.VITE_APP_CDN}/com/bg-box.png`,
      used: true,
    },
  ],
}

export const interact = {
  type: 'interact',
  name: '交互',
  icon: 'v-icon-interact',
  data: [
    {
      name: 'VTabList',
      alias: 'Tab列表',
      img: `${import.meta.env.VITE_APP_CDN}/com/tab-list.png`,
      used: true,
    }, {
      name: 'VFullScreen',
      alias: '全屏切换',
      img: `${import.meta.env.VITE_APP_CDN}/com/full-screen.png`,
      used: true,
    }, {
      name: 'VTabSelect',
      alias: 'Tab选择器',
      img: `${import.meta.env.VITE_APP_CDN}/com/tab-select.png`,
      used: true,
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
      used: true,
    },
  ],
}

export const classifications = [
  {
    type: 'regular',
    name: '常规图表',
    icon: 'v-icon-chart',
    data: [bar, line, pie],
  },
  {
    type: 'map',
    name: '地图',
    icon: 'v-icon-map',
    data: [map],
  },
  {
    type: 'media',
    name: '媒体',
    icon: 'v-icon-media',
    data: [img],
  },
  {
    type: 'text',
    name: '文本',
    icon: 'v-icon-font',
    data: [title, list],
  },
  {
    type: 'relation',
    name: '关系网络',
    icon: 'v-icon-relation',
    data: [relation],
  },
  {
    type: 'material',
    name: '素材',
    icon: 'v-icon-material',
    data: [material],
  },
  {
    type: 'interact',
    name: '交互',
    icon: 'v-icon-interact',
    data: [interact],
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
