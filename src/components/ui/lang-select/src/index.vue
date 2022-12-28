<template>
  <n-dropdown
    trigger="click"
    size="small"
    :options="languages"
    @select="handleSetLanguage"
  >
    <n-icon>
      <IconInternational />
    </n-icon>
  </n-dropdown>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NDropdown, NIcon } from 'naive-ui'
import { SUPPORT_LOCALES, loadLocaleMessages } from '@/locales'
import { IconInternational } from '@/icons'

const nMessage = useMessage()
const i18n = useI18n()

const language = ref('zh-CN')
const languages = computed(() => {
  return Object.entries(SUPPORT_LOCALES)
    .map(([key, label]) => ({
      key,
      label,
      disabled: key === language.value,
    }))
})

const handleSetLanguage = async (lang: string) => {
  language.value = lang
  await loadLocaleMessages(lang)
  nMessage.warning(i18n.t('g.Language switch successfully'))
}
</script>
