import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/_models/data-source'
import { DataEventConfig } from '@/components/_models/data-event'
import { BorderImage } from '@/components/_models/border-image'

/**
 * BorderBox
 */
export class BorderBox extends DatavComponent {
  config = {
    boxStyle: {
      style: 'box15',
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BorderBox', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    this.apis = {}
    this.apiData = {}
    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {}
}

export const presetImages: BorderImage[] = [
  {
    id: 'box1',
    name: '框1',
    src: 'https://files.pengxiaotian.com/bg-box/box1-1540-292.png',
    border: {
      width: '4px 805px 281px 730px', outset: '0', slice: '4 805 281 730 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box2',
    name: '框2',
    src: 'https://files.pengxiaotian.com/bg-box/box2-1310-182.png',
    border: {
      width: '65px 740px 88px 560px', outset: '0', slice: '65 740 88 561 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box3',
    name: '框3',
    src: 'https://files.pengxiaotian.com/bg-box/box3-1390-146.png',
    border: {
      width: '101px 690px 35px 693px', outset: '0', slice: '101 690 35 693 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box4',
    name: '框4',
    src: 'https://files.pengxiaotian.com/bg-box/box4-1270-840.png',
    border: {
      width: '423px 606px 410px 652px', outset: '0', slice: '423 606 410 652 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box5',
    name: '框5',
    src: 'https://files.pengxiaotian.com/bg-box/box5-1168-686.png',
    border: {
      width: '220px 664px 460px 500px', outset: '0', slice: '220 664 460 500 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box6',
    name: '框6',
    src: 'https://files.pengxiaotian.com/bg-box/box6-1186-616.png',
    border: {
      width: '288px 500px 272px 680px', outset: '0', slice: '288 500 272 680 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box7',
    name: '框7',
    src: 'https://files.pengxiaotian.com/bg-box/box7-580-742.png',
    border: {
      width: '71px 23px', outset: '0', slice: '71 23 fill', repeat: 'stretch',
    },
  },
  {
    id: 'box8',
    name: '框8',
    src: 'https://files.pengxiaotian.com/bg-box/box8-592-131.png',
    border: {
      width: '17px 24px 18px 19px', outset: '0', slice: '17 24 18 19 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box9',
    name: '框9',
    src: 'https://files.pengxiaotian.com/bg-box/box9-524-282.png',
    border: {
      width: '56px 4px 76px 393px', outset: '0', slice: '56 4 76 393 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box10',
    name: '框10',
    src: 'https://files.pengxiaotian.com/bg-box/box10-731-407.png',
    border: {
      width: '152px 27px 127px 354px', outset: '0', slice: '152 27 127 354 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box11',
    name: '框11',
    src: 'https://files.pengxiaotian.com/bg-box/box11-492-335.png',
    border: {
      width: '15px 11px 16px 8px', outset: '0', slice: '15 11 16 8 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box12',
    name: '框12',
    src: 'https://files.pengxiaotian.com/bg-box/box12-986-212.png',
    border: {
      width: '29px 107px 109px 16px', outset: '0', slice: '29 107 109 16 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box13',
    name: '框',
    src: 'https://files.pengxiaotian.com/bg-box/box13.png',
    border: {
      width: '45px 103px 51px 29px', outset: '0', slice: '45 103 51 29 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box14',
    name: '框14',
    src: 'https://files.pengxiaotian.com/bg-box/box14-689-232.png',
    border: {
      width: '46px 305px 117px 33px', outset: '0', slice: '46 305 117 33 fill', repeat: 'repeat',
    },
  },
  {
    id: 'box15',
    name: '框15',
    src: 'https://files.pengxiaotian.com/bg-box/box15.png',
    border: {
      width: '14px 100px', outset: '0', slice: '14 100', repeat: 'stretch',
    },
  },
  {
    id: 'box16',
    name: '框16',
    src: 'https://files.pengxiaotian.com/bg-box/box16-116-115.png',
    border: {
      width: '14px 100px', outset: '0', slice: '14 100', repeat: 'stretch',
    },
  },
  {
    id: 'box17',
    name: '框17',
    src: 'https://files.pengxiaotian.com/bg-box/box17.png',
    border: {
      width: '32px 37px', outset: '0', slice: '32 37 fill', repeat: 'stretch',
    },
  },
  {
    id: 'box18',
    name: '框18',
    src: 'https://files.pengxiaotian.com/bg-box/box18-126-154.png',
    border: {
      width: '71px 23px', outset: '0', slice: '71 23', repeat: 'stretch',
    },
  },
]

export default BorderBox
