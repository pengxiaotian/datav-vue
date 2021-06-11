
import type { Ref } from 'vue'

export function useObserverDomResize (dom: HTMLElement | Ref<HTMLElement>, callback: () => any) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  const observer = new MutationObserver(callback)

  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })

  return observer
}
