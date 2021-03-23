// 背景图路径
const bgImg = `${process.env.VUE_APP_QINIU_FILE}/datav/bj.png`

// 封面图
const coverImg = `${process.env.VUE_APP_QINIU_FILE}/datav/datav-vue-logo.png`

// 项目拖拽图
const dragImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABQCAMAAADVyVCaAAAAM1BMVEVHcEwXvP8b1/8TV20UQVEZzf8Tn/8UiaMWqc4VkrEZw/AWsv8Vj7EUqf8YuOITRFYViKUfZVF5AAAACnRSTlMA////////Jt+CR+EzygAAAL9JREFUWMPt2FsOwjAMRNGGuKX0kbL/1bIBQv0YR0Kau4Ejz0+kTBNjjLGxPTptTxwh33uv6cTVXtmEVNhUXQI31dwlYFP1CdhUPwg51nQCNNWMyH+FNhIkhhIFQBQSUltNJup2JF+hEyKEUggQWsFPqAU3oRe8hEFwEhbhjtjjguweopVeMGLAFTbDR5gMJ2ExvITBcBN6w0+ojRviBLwXZ4BQGiFC93bHCEkfisRIYvkPYiGBIRDx/5Mxxsb2AVpUNS9SI1eoAAAAAElFTkSuQmCC'

const boxImg = [
  {
    id: 'box1', value: '框1', src: `${process.env.VUE_APP_QINIU_FILE}/box/box1-126-154.png`, width: [71, 23], slice: [71, 23], repeat: 'initial',
  },
  {
    id: 'box2', value: '框2', src: `${process.env.VUE_APP_QINIU_FILE}/box/box2-79-67.png`, width: [32, 37], slice: [32, 37, 'fill'], repeat: 'initial',
  },
  {
    id: 'box3', value: '框3', src: `${process.env.VUE_APP_QINIU_FILE}/box/box3-116-115.png`, width: [14], slice: [14, 'fill'], repeat: 'initial',
  },
  {
    id: 'box4', value: '框4', src: `${process.env.VUE_APP_QINIU_FILE}/box/box4-241-138.png`, width: [14, 100], slice: [14, 100], repeat: 'initial',
  },
  {
    id: 'box5', value: '框5', src: `${process.env.VUE_APP_QINIU_FILE}/box/box5-689-232.png`, width: [46, 305, 117, 33], slice: [46, 305, 117, 33, 'fill'], repeat: 'repeat',
  },
  {
    id: 'box6', value: '框6', src: `${process.env.VUE_APP_QINIU_FILE}/box/box6-484-101.png`, width: [45, 103, 51, 29], slice: [45, 103, 51, 29, 'fill'], repeat: 'repeat',
  },
  {
    id: 'box7', value: '框7', src: `${process.env.VUE_APP_QINIU_FILE}/box/box7-986-212.png`, width: [29, 107, 109, 16], slice: [29, 107, 109, 16, 'fill'], repeat: 'repeat',
  },
  {
    id: 'box8', value: '框8', src: `${process.env.VUE_APP_QINIU_FILE}/box/box8-492-335.png`, width: [15, 11, 16, 8], slice: [15, 11, 16, 8, 'fill'], repeat: 'repeat',
  },
  {
    id: 'box9', value: '框9', src: `${process.env.VUE_APP_QINIU_FILE}/box/box9-731-407.png`, width: [152, 27, 127, 354], slice: [152, 27, 127, 354, 'fill'], repeat: 'repeat',
  },
  {
    id: 'box10', value: '框10', src: `${process.env.VUE_APP_QINIU_FILE}/box/box10-524-282.png`, width: [56, 4, 76, 393], slice: [56, 4, 76, 393, 'fill'], repeat: 'repeat',
  },
  {
    id: 'box11', value: '框11', src: `${process.env.VUE_APP_QINIU_FILE}/box/box11-592-131.png`, width: [17, 24, 18, 19], slice: [17, 24, 18, 19, 'fill'], repeat: 'repeat',
  },
]

const decorateImg = [
  {
    id: 'gif1', value: 'gif1', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco1-1920-1080.gif`, size: '100%', position: 'left bottom',
  },
  {
    id: 'gif2', value: 'gif2', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco2-1920-1080.gif`, size: '100%', position: 'center center',
  },
  {
    id: 'gif3', value: 'gif3', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco3-1080-824.gif`, size: '100%', position: 'right top',
  },
  {
    id: 'gif4', value: 'gif4', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco4-1080-824.gif`, size: '100%', position: 'right bottom',
  },
  {
    id: 'gif5', value: 'gif5', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco5-1920-1080.gif`, size: '100%', position: 'left top',
  },
  {
    id: 'gif6', value: 'gif6', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco6-1626-356.gif`, size: '100%', position: 'center center',
  },
  {
    id: 'gif7', value: 'gif7', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco7-94-1461.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 'gif8', value: 'gif8', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco8-500-54.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 'gif9', value: 'gif9', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco9-500-64.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 'gif10', value: 'gif10', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco10-782-259.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 'png11', value: 'png11', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco11-58-36.png`, size: '100%', position: 'center center',
  },
  {
    id: 'png12', value: 'png12', src: `${process.env.VUE_APP_QINIU_FILE}/decoration/deco12-58-36.png`, size: '100%', position: 'center center',
  },
]

export {
  bgImg,
  coverImg,
  dragImg,
  boxImg,
  decorateImg,
}
