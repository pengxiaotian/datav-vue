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

const decorateImgs = decorates.map(m => ({
  ...m,
  src: `${import.meta.env.VITE_APP_CDN}/decoration/${m.src}`,
}))

export {
  decorateImgs,
}

