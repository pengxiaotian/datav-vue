// 背景图
const bgImg = `${import.meta.env.VITE_APP_QINIU_FILE}/datav/bj.png`

// 封面图
const coverImg = `${import.meta.env.VITE_APP_QINIU_FILE}/datav/datav-vue-logo.png`

// 拖拽图
const dragImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABQCAMAAADVyVCaAAAAM1BMVEVHcEwXvP8b1/8TV20UQVEZzf8Tn/8UiaMWqc4VkrEZw/AWsv8Vj7EUqf8YuOITRFYViKUfZVF5AAAACnRSTlMA////////Jt+CR+EzygAAAL9JREFUWMPt2FsOwjAMRNGGuKX0kbL/1bIBQv0YR0Kau4Ejz0+kTBNjjLGxPTptTxwh33uv6cTVXtmEVNhUXQI31dwlYFP1CdhUPwg51nQCNNWMyH+FNhIkhhIFQBQSUltNJup2JF+hEyKEUggQWsFPqAU3oRe8hEFwEhbhjtjjguweopVeMGLAFTbDR5gMJ2ExvITBcBN6w0+ojRviBLwXZ4BQGiFC93bHCEkfisRIYvkPYiGBIRDx/5Mxxsb2AVpUNS9SI1eoAAAAAElFTkSuQmCC'

const boxs = [
  {
    id: 1, src: `box1-126-154.png`, width: [71, 23], slice: [], repeat: 'initial',
  },
  {
    id: 2, src: `box2-79-67.png`, width: [32, 37], slice: ['fill'], repeat: 'initial',
  },
  {
    id: 3, src: `box3-116-115.png`, width: [14], slice: ['fill'], repeat: 'initial',
  },
  {
    id: 4, src: `box4-241-138.png`, width: [14, 100], slice: [], repeat: 'initial',
  },
  {
    id: 5, src: `box5-689-232.png`, width: [46, 305, 117, 33], slice: ['fill'], repeat: 'repeat',
  },
  {
    id: 6, src: `box6-484-101.png`, width: [45, 103, 51, 29], slice: ['fill'], repeat: 'repeat',
  },
  {
    id: 7, src: `box7-986-212.png`, width: [29, 107, 109, 16], slice: ['fill'], repeat: 'repeat',
  },
  {
    id: 8, src: `box8-492-335.png`, width: [15, 11, 16, 8], slice: ['fill'], repeat: 'repeat',
  },
  {
    id: 9, src: `box9-731-407.png`, width: [152, 27, 127, 354], slice: ['fill'], repeat: 'repeat',
  },
  {
    id: 10, src: `box10-524-282.png`, width: [56, 4, 76, 393], slice: ['fill'], repeat: 'repeat',
  },
  {
    id: 11, src: `box11-592-131.png`, width: [17, 24, 18, 19], slice: ['fill'], repeat: 'repeat',
  },
]

const decorates = [
  {
    id: 1, src: `deco1-1920-1080.gif`, size: '100%', position: 'left bottom',
  },
  {
    id: 2, src: `deco2-1920-1080.gif`, size: '100%', position: 'center center',
  },
  {
    id: 3, src: `deco3-1080-824.gif`, size: '100%', position: 'right top',
  },
  {
    id: 4, src: `deco4-1080-824.gif`, size: '100%', position: 'right bottom',
  },
  {
    id: 5, src: `deco5-1920-1080.gif`, size: '100%', position: 'left top',
  },
  {
    id: 6, src: `deco6-1626-356.gif`, size: '100%', position: 'center center',
  },
  {
    id: 7, src: `deco7-94-1461.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 8, src: `deco8-500-54.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 9, src: `deco9-500-64.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 10, src: `deco10-782-259.gif`, size: 'contain', position: 'left top',
  },
  {
    id: 11, src: `deco11-58-36.png`, size: '100%', position: 'center center',
  },
  {
    id: 12, src: `deco12-58-36.png`, size: '100%', position: 'center center',
  },
]

const boxImgs = boxs.map(m => ({
  ...m,
  src: `${import.meta.env.VITE_APP_QINIU_FILE}/box/${m.src}`,
  slice: [...m.width, ...m.slice],
}))

const decorateImgs = decorates.map(m => ({
  ...m,
  src: `${import.meta.env.VITE_APP_QINIU_FILE}/decoration/${m.src}`,
}))

export {
  bgImg,
  coverImg,
  dragImg,
  boxImgs,
  decorateImgs,
}
