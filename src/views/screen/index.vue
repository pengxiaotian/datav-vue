<template>
  <div
    id="datav-loading"
    :style="{
      background: 'rgb(15, 42, 66)',
      display: loading ? 'block' : 'none',
    }"
  >
    <a target="_blank" href="javascript:;">
      <img class="datav-logo" :src="`${cdn}/datav/datav-loading.gif`">
    </a>
  </div>
  <div class="datav-layout" :style="{ visibility: loading ? 'hidden' : 'visible' }">
    <a
      v-if="pageConfig.useWatermark"
      href="/"
      target="_blank"
      class="datav-watermark"
    >
      <img :src="LOGO">
    </a>
    <div class="scene">
      <div
        v-for="com in coms"
        :key="com.id"
        :style="{
          left: com.attr.x + 'px',
          top: com.attr.y + 'px',
          width: com.attr.w + 'px',
          height: com.attr.h + 'px',
          opacity: com.attr.opacity,
          transform: `rotate(${com.attr.deg}deg) ${com.attr.filpH ? 'scaleX(-1)' : ''} ${com.attr.filpV ? 'scaleY(-1)' : ''}`,
          filter: styleFilter,
        }"
        class="-datav-com absolute"
      >
        <component :is="com.name" :com="com" />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { globalConfig } from '@/config'
import { useEditorStore } from '@/store/editor'
import { useFilterStore } from '@/store/filter'
import { useComStore } from '@/store/com'
import { useEventStore } from '@/store/event'
import { PageConfig, ZoomMode } from '@/domains/editor'
import { setStyle, on } from '@/utils/dom'
import { getScreen } from '@/api/screen'

const cdn = import.meta.env.VITE_APP_CDN

export default defineComponent({
  name: 'Preview',
  props: {
    screenId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const filterStore = useFilterStore()
    const editorStore = useEditorStore()
    const comStore = useComStore()
    const eventStore = useEventStore()
    const loading = ref(true)
    const { pageConfig } = storeToRefs(editorStore)
    const { coms } = storeToRefs(comStore)
    const styleFilter = computed(() => {
      const sf = pageConfig.value.styleFilterParams
      let filter = ''
      if (sf.enable) {
        filter = `hue-rotate(${sf.hue}deg) contrast(${sf.contrast}%) opacity(${sf.opacity}%) saturate(${sf.saturate}%) brightness(${sf.brightness}%)`
      }
      return filter
    })

    const resizeAuto = (width: number, height: number) => {
      const cw = document.documentElement.clientWidth
      const ch = document.documentElement.clientHeight
      const ratioX = cw / width
      const ratioY = ch / height
      setStyle(document.body, {
        transform: `scale(${ratioX}, ${ratioY})`,
        transformOrigin: 'left top',
        backgroundSize: '100% 100%',
      } as CSSStyleDeclaration)
    }

    const resizeWidth = (width: number) => {
      const ratio = document.documentElement.clientWidth / width
      setStyle(document.body, {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        backgroundSize: '100%',
      } as CSSStyleDeclaration)
    }

    const resizeHeight = (width: number, height: number) => {
      const cw = document.documentElement.clientWidth
      const ch = document.documentElement.clientHeight
      const ratio = ch / height
      const gap = (cw - width * ratio) / 2
      setStyle(document.body, {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        backgroundSize: `${(width / cw * ratio) * 100}% 100%`,
        backgroundPosition: `${gap.toFixed(3)}px top`,
        marginLeft: `${gap.toFixed(3)}px`,
      } as CSSStyleDeclaration)
    }

    const resizeFull = (width: number, height: number) => {
      const cw = document.documentElement.clientWidth
      const ch = document.documentElement.clientHeight
      const ratio = ch / height
      const gap = (cw - width * ratio) / 2
      setStyle(document.body, {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        backgroundSize: `${(width / cw * ratio) * 100}% 100%`,
        backgroundPosition: `${gap.toFixed(3)}px top`,
        // marginLeft: `${gap.toFixed(3)}px`,
      } as CSSStyleDeclaration)

      document.documentElement.style.overflowX = 'scroll'
    }

    const resizeNone = () => {
      setStyle(document.body, {
        overflow: 'hidden',
        position: 'relative',
      } as CSSStyleDeclaration)
    }

    const resize = (config: PageConfig) => {
      switch (config.zoomMode) {
        case ZoomMode.auto:
          resizeAuto(config.width, config.height)
          break
        case ZoomMode.width:
          resizeWidth(config.width)
          break
        case ZoomMode.height:
          resizeHeight(config.width, config.height)
          break
        case ZoomMode.full:
          resizeFull(config.width, config.height)
          break
        default:
          resizeNone()
          break
      }
    }

    const initPageInfo = (config: PageConfig) => {
      document.title = editorStore.screen.name
      document.querySelector('meta[name="viewport"]')
        .setAttribute('content', `width=${config.width}`)

      setStyle(document.documentElement, {
        overflowX: 'hidden',
        overflowY: 'visible',
      } as CSSStyleDeclaration)

      setStyle(document.body, {
        width: `${config.width}px`,
        height: `${config.height}px`,
        backgroundImage: `url(${pageConfig.value.bgimage})`,
        backgroundColor: pageConfig.value.bgcolor,
      } as CSSStyleDeclaration)

      resize(config)
    }

    const router = useRouter()

    onMounted(async () => {
      try {
        const data = await getScreen(+props.screenId)
        if (data) {
          editorStore.setEditorOption({
            screen: data.screen,
            config: data.config,
          })
          initPageInfo(data.config)

          comStore.setComs(data.coms)
          const { componentsView, publishersView, subscribersView } = data.variables
          eventStore.$patch({ componentsView, publishersView, subscribersView })
          filterStore.$patch({ dataFilters: data.dataFilters ?? [] })

          setTimeout(() => {
            loading.value = false
          }, 500)

          on(window, 'resize', () => {
            resize(pageConfig.value)
          })
        } else {
          throw new Error('404')
        }
      } catch (error) {
        router.replace({
          name: 'NotFound',
          params: { catchAll: 'error' },
        })
      }
    })

    return {
      cdn,
      LOGO: globalConfig.logo,
      loading,
      pageConfig,
      coms,
      styleFilter,
    }
  },
})
</script>

<style lang="scss">
html,
body {
  min-width: auto;
}

#datav-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f2a42;
  z-index: 2;

  .datav-logo,
  .text-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .datav-logo {
    width: 120px;
  }

  .text-logo {
    margin-top: 73px;
    width: 100px;
  }
}

.datav-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;

  .-datav-com.absolute {
    position: absolute !important;
    margin: 0 !important;
  }
}

.datav-watermark {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 99999999;
  width: 50px;

  img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
}
</style>
