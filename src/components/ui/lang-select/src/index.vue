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

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { SUPPORT_LOCALES, loadLocaleMessages } from '@/locales'
import { IconInternational } from '@/icons'

export default defineComponent({
  name: 'GLangSelect',
  components: {
    IconInternational,
  },
  setup() {
    const nMessage = useMessage()
    const { t } = useI18n({ useScope: 'global' })
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

      nMessage.warning(t('g.Language switch successfully'))
    }

    return {
      languages,
      language,
      handleSetLanguage,
    }
  },
})
</script>
