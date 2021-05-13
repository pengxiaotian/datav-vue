<template>
  <el-dropdown
    trigger="click"
    @command="handleSetLanguage"
  >
    <div>
      <i class="v-icon-international"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="l in languages"
          :key="l.key"
          :command="l.key"
          :disabled="language === l.key"
        >
          {{ l.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES, loadLocaleMessages } from '@/locales'
import { MessageUtil } from '@/utils/message-util'

export default defineComponent({
  name: 'GLangSelect',
  setup() {
    const { t } = useI18n({ useScope: 'global' })
    const languages = ref(Object.entries(SUPPORT_LOCALES).map(([key, name]) => ({ key, name })))
    const language = ref('zh-CN')


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
