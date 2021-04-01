export const bar = {
  type: 'bar',
  name: '柱图',
  icon: 'v-icon-chart-bar',
  data: [
    {
      type: 'VBasicBar',
      name: '基本柱状图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/basic-bar.png`,
      used: true,
    }, {
      type: 'VArcBar',
      name: '弧形柱图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/arc-bar.png`,
      used: true,
    }, {
      type: 'VBarWithLine',
      name: '折线柱图(多)',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/bar-with-line.png`,
      used: true,
    }, {
      type: 'VLineBarChart',
      name: '折线柱图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/line-bar-chart.png`,
      used: true,
    }, {
      type: 'VHoriBasicBar',
      name: '水平基本柱状图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/hori-basic-bar.png`,
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
      type: 'VBasicLine',
      name: '基本折线图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/basic-line.png`,
      used: true,
    }, {
      type: 'VBasicArea',
      name: '区域图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/basic-area.png`,
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
      type: 'VBasicPie',
      name: '基本饼图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/basic-pie.png`,
      used: true,
    }, {
      type: 'VPieOneValue',
      name: '指标占比图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/pie-one-value.png`,
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
      type: 'VChina2d',
      name: '基础平面地图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/2d-china.png`,
      used: true,
      children: [
        {
          type: 'VChina2dEffectScatter',
          name: '动态气泡层',
          icon: `${process.env.VUE_APP_HOST_FILE}/com/2d-china.png`,
          used: true,
        }, {
          type: 'VChina2dFlyLines',
          name: '飞线层',
          icon: `${process.env.VUE_APP_HOST_FILE}/com/2d-china.png`,
          used: true,
        },
      ],
    }, {
      type: 'VBasicLine',
      name: '世界',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/3d-world.png`,
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
      type: 'VMainImg',
      name: '单张图片',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/main-img.png`,
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
      type: 'VMainTitle',
      name: '通用标题',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/main-title.png`,
      used: true,
    }, {
      type: 'VMarquee',
      name: '跑马灯',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/marquee.png`,
      used: true,
    }, {
      type: 'VWordCloud',
      name: '词云',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/word-cloud.png`,
      used: true,
    }, {
      type: 'VNumberTitleFlop',
      name: '数字翻牌器',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/number-title-flop.png`,
      used: true,
    }, {
      type: 'VParagraph',
      name: '多行文本',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/paragraph.png`,
      used: true,
    }, {
      type: 'VPercentageBar',
      name: '进度条',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/percentage-bar.png`,
      used: true,
    }, {
      type: 'VTimer',
      name: '时间器',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/timer.png`,
      used: true,
    },
  ],
}

export const list = {
  type: 'list',
  name: '列表',
  icon: 'v-icon-list',
  data: [
    {
      type: 'VCarouselTable',
      name: '轮播列表',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/carousel-table.png`,
      used: true,
    }, {
      type: 'VTableBar',
      name: '轮播列表柱状图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/table-bar.png`,
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
      type: 'VTree',
      name: '树图',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/tree.png`,
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
      type: 'VDecoration',
      name: '装饰',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/decoration.png`,
      used: true,
    }, {
      type: 'VBorderBox',
      name: '边框',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/border-box.png`,
      used: true,
    }, {
      type: 'VBGBox',
      name: '自定义背景',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/bg-box.png`,
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
      type: 'VTabList',
      name: 'Tab列表',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/tab-list.png`,
      used: true,
    }, {
      type: 'VFullScreen',
      name: '全屏切换',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/full-screen.png`,
      used: true,
    }, {
      type: 'VTabSelect',
      name: 'Tab选择器',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/tab-select.png`,
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
      type: 'VDatePicker',
      name: '日期选择器',
      icon: `${process.env.VUE_APP_HOST_FILE}/com/date-picker.jpg`,
      used: true,
    },
  ],
}

export const categories = [
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

export function findByComName(name: string) {
  for (let i = 0; i < categories.length; i++) {
    const category1 = categories[i]
    for (let j = 0; j < category1.data.length; j++) {
      const category2 = category1.data[j]
      const com = category2.data.find(m => m.type === name)
      if (com) {
        return {
          category1,
          category2,
          com,
        }
      }
    }
  }

  return null
}
