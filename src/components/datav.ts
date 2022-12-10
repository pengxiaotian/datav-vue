import { kebabCase } from 'lodash-es'

const correctStr = (str: string) => {
  return str
    .replace('-2-d', '2d')
    .replace('-3-d', '3d')
}

export async function createComponent(name: string) {
  const path = correctStr(kebabCase(name.substring(1)))
  switch (name.substring(1)) {
    // bar
    case 'BasicBar':
    {
      const comModule = await import(`./bar/${path}/src/${path}.ts`)
      return new comModule.default()
    }

    // line
    case 'BasicLine':
    {
      const comModule = await import(`./line/${path}/src/${path}.ts`)
      return new comModule.default()
    }

    // map
    case 'China2d':
    {
      const comModule = await import(`./map/${path}/src/${path}.ts`)
      return new comModule.default()
    }
    case 'China2dArea':
    case 'China2dBubbles':
    case 'China2dFlyingline':
    {
      const comModule = await import(`./map/china2d/src/${path}/index.ts`)
      return new comModule.default()
    }

    // chart
    case 'WordCloud':
    {
      const comModule = await import(`./chart/${path}/src/${path}.ts`)
      return new comModule.default()
    }

    // text
    case 'MainTitle':
    case 'Marquee':
    case 'NumberTitleFlop':
    case 'Paragraph':
    case 'Timer':
    {
      const comModule = await import(`./text/${path}/src/${path}.ts`)
      return new comModule.default()
    }

    // button
    case 'FullScreen':
    {
      const comModule = await import(`./button/${path}/src/${path}.ts`)
      return new comModule.default()
    }

    // media
    case 'BgBox':
    case 'BorderBox':
    case 'Decoration':
    case 'MainImg':
    {
      const comModule = await import(`./media/${path}/src/${path}.ts`)
      return new comModule.default()
    }

    // other
    case 'DatePicker':
    {
      const comModule = await import(`./other/${path}/src/${path}.ts`)
      return new comModule.default()
    }
    default:
      throw Error(`Unknown component type: ${name}.`)
  }
}
