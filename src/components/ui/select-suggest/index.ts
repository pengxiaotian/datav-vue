import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import SelectSuggest from './src/index.vue'

SelectSuggest.install = (app: App): void => {
  app.component(SelectSuggest.name, SelectSuggest)
}

export default SelectSuggest as SFCWithInstall<typeof SelectSuggest>
