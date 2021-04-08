import { App } from 'vue'
import UploadImage from './src/index.vue'

UploadImage.install = (app: App): void => {
  app.component(UploadImage.name, UploadImage)
}

export default UploadImage
