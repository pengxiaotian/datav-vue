import { kebabCase } from 'lodash-es'

const correctStr = (str: string) => {
  return str
    .replace('-2-d', '2d')
    .replace('-3-d', '3d')
}

export async function createComponent(name: string) {
  const modules: Record<string, () => Promise<any>> = import.meta.glob([
    '@/components/**/*.ts',
    '!@/components/_*/**/*',
    '!@/components/ui/**/*',
    '!@/components/*',
  ])

  const file = correctStr(kebabCase(name.substring(1)))
  const paths = Object.keys(modules)
  let path = paths.find(m => m.includes(`src/${file}.ts`))
  if (!path) {
    path = paths.find(m => m.includes(`${file}/index.ts`))
  }

  if (path) {
    const mod = await modules[path]()
    return new mod.default()
  }

  throw Error(`Unknown component type: ${name}.`)
}
