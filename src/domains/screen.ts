
import { ref } from 'vue'
import * as api from '@/api/screen'
import { MessageUtil } from '@/utils/message-util'
import { Project } from './project.entity'

export class Screen extends Project {

}


export const ScreenStore = () => {
  const loading = ref(true)
  const srceen = ref<Partial<Screen>>({})

  const getScreenInfo = async (screenId: number) => {
    try {
      const res = await api.getScreen(screenId)
      if (res.data.code === 0) {
        srceen.value = res.data.data
        document.title = `${res.data.data.name} | 编辑器`
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      MessageUtil.error(MessageUtil.format(error))
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    srceen,
    getScreenInfo,
  }
}
