<template>
  <n-dropdown
    trigger="click"
    size="small"
    :options="languages"
    @select="handleSetLanguage"
  >
    <IconInternational size="16px" />
  </n-dropdown>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES, loadLocaleMessages } from '@/locales'
import { MessageUtil } from '@/utils/message-util'
import { IconInternational } from '@/icons'

export default defineComponent({
  name: 'GLangSelect',
  components: {
    IconInternational,
  },
  setup() {
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

      MessageUtil.success(t('g.Language switch successfully'))
    }

    return {
      languages,
      language,
      handleSetLanguage,
    }
  },
})
</script>
