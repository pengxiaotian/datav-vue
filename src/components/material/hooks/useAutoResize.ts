import { ref, Ref, nextTick, onBeforeUnmount, unref, watchEffect } from 'vue'
import { isFunction } from '@/utils/is'
import { useTimeoutFn } from '@/hooks/core/useTimeout'
import { useObserverDomResize } from '@/hooks/web/useObserverResize'

export function useAutoResize(dom: Ref<HTMLElement>, onResize?: () => void){
  const widthRef = ref(0)
  const heightRef = ref(0)
  const domObserver = ref()


  watchEffect(() => {
    autoResizeMixinInit()
  })

  onBeforeUnmount(() => {
    unbindDomResizeCallback()
  })

  async function autoResizeMixinInit() {
    await initWH(false)
    bindDomResizeCallback()
  }

  function initWH (resize = true) {
    return new Promise(resolve => {
      nextTick(() => {
        widthRef.value = unref(dom) && (dom.value.clientWidth ?? 0)
        heightRef.value = unref(dom) && (dom.value.clientHeight ?? 0)
        if (!unref(dom)) {
          console.warn('Failed to get dom node, component rendering may be abnormal!')
        } else if (!unref(widthRef) || !unref(heightRef)) {
          console.warn('Component width or height is 0px, rendering abnormality may occur!')
        }
        isFunction(onResize) && resize && onResize()

        resolve(true)
      })
    })
  }

  function bindDomResizeCallback () {
    domObserver.value = useObserverDomResize(unref(dom), () => useTimeoutFn(initWH, 100))

    window.addEventListener('resize', () => useTimeoutFn(initWH, 100))
  }

  function unbindDomResizeCallback () {

    if (!unref(domObserver)) return

    unref(domObserver).disconnect()
    unref(domObserver).takeRecords()
    domObserver.value = null
  }


  return [widthRef, heightRef, domObserver]
}
