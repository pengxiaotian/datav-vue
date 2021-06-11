
export function useObserverDomResize (dom: HTMLElement, callback: () => void) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  const observer = new MutationObserver(callback)

  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })

  return observer
}
