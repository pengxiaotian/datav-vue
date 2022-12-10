import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

import zhCN from './lang/zh-CN.js'

const loadedLanguages = ['zh-CN']

export const SUPPORT_LOCALES = {
  'zh-CN': '中文',
  en: 'English',
}

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: loadedLanguages[0],
  fallbackLocale: loadedLanguages[0],
  messages: {
    'zh-CN': zhCN,
  },
})

// 获取当前语言环境
export function getLanguage(): string {
  return document.documentElement.lang || loadedLanguages[0]
}

/**
 * 设置当前语言环境
 *
 * 前提是该语言文件已经加载好了，否则请使用 loadLocaleMessages
 */
export function setLanguage(locale: string) {
  i18n.global.locale.value = locale as any
  document.documentElement.lang = locale
}

export async function loadLocaleMessages(locale: string) {
  if (i18n.global.locale.value === locale || loadedLanguages.includes(locale)) {
    return Promise.resolve(setLanguage(locale))
  }

  try {
    // load locale messages with dynamic import
    const messages = await import(`./lang/${locale}.js` )

    // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages.default)
    loadedLanguages.push(locale)
    return setLanguage(locale)
  } catch {
    console.error(`Failed to load locale file: ${locale}`)
  }

  return nextTick()
}

export default i18n
