<template>
  <AsyncLoading v-if="loading" />
  <div
    :id="editorId"
    class="datav-editor"
    :class="[{
      '--read-only': readOnly,
    }, editorClass]"
  >
    <div v-if="!loading" class="datav-editor-actions">
      <n-icon class="action-btn" title="点击复制" @click="copyData">
        <IconCopy />
      </n-icon>
      <n-icon
        class="action-btn"
        :title="isFullScreen ? '退出全屏' : '全屏模式下编辑或查看'"
        @click="switchFullScreen"
      >
        <IconFullscreenExit v-if="isFullScreen" />
        <IconFullscreen v-else />
      </n-icon>
    </div>
  </div>

  <n-modal
    v-model:show="isFullScreen"
    :title="`${fullScreenTitle}${readOnly ? ' ( 只读 )' : ''}`"
    preset="dialog"
    :show-icon="false"
    :mask-closable="false"
    class="datav-fullscreen-editor-dialog"
    style="width: 90%; margin-top: 1%;"
    @after-leave="closedFullScreenDialog"
  >
    <div class="datav-fullscreen-editor-wp">
      <div
        class="datav-editor datav-fullscreen-editor"
        :class="[{
          '--read-only': readOnly,
        }]"
      >
        <section style="display: flex; position: relative; text-align: initial; width: 100%; height: 100%;"></section>
      </div>
    </div>
  </n-modal>
</template>

<script lang='ts' setup>
import { nextTick, onMounted, onUnmounted, ref, PropType, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useMessage, NIcon, NModal } from 'naive-ui'
import type { editor as MEditor } from 'monaco-editor'
import type { Monaco } from '@monaco-editor/loader'
import loader from '@monaco-editor/loader'
import { generateId, copyText } from '@/utils/util'
import { IconCopy, IconFullscreen, IconFullscreenExit } from '@/icons'
import AsyncLoading from '../../loading/src/async-loading.vue'
import {
  languageType, defaultOpts,
  registerDatavDarkTheme, registerApiCompletion,
  handleInputCode, formatDocument,
} from './editor-config'

loader.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.33.0/min/vs' } })

const props = defineProps( {
  language: {
    type: String as PropType<languageType>,
    default: 'plaintext',
  },
  code: {
    type: [String, Array, Object],
    default: '',
  },
  readOnly: Boolean,
  useMinimap: Boolean,
  lineNumbers: {
    type: String,
    default: 'on',
  },
  wordWrap: {
    type: String,
    default: 'on',
  },
  autoFormat: Boolean,
  options: {
    type: Object as PropType<Partial<MEditor.IStandaloneEditorConstructionOptions>>,
    default() {
      return {}
    },
  },
  completions: Array as PropType<Array<string>>,
  extra: Object,
  height: {
    type: Number,
    default: 240,
  },
  editorClass: String,
  fullScreenTitle: {
    type: String,
    default: '全屏模式',
  },
})
const emits = defineEmits(['change', 'blur'])

const nMessage = useMessage()

const themeName = 'datav-dark-theme'
const editorId = `datav-editor-${generateId()}`
const isFullScreen = ref(false)
const loading = ref(false)

let monaco: Monaco | null = null
let editor: MEditor.IStandaloneCodeEditor | null = null
let fullEditor: MEditor.IStandaloneCodeEditor | null = null

const copyData = () => {
  if (editor) {
    copyText(editor.getValue()).then(() => {
      nMessage.success('复制成功')
    })
  }
}

const changeHandler = () => {
  if (editor) {
    const value = editor.getValue()
    emits('change', {
      value,
      extra: props.extra,
    })
  }
}

const blurHandler = () => {
  if (editor) {
    const value = editor.getValue()
    emits('blur', {
      value,
      extra: props.extra,
    })
    if (props.autoFormat) {
      formatDocument(editor, props.language)
    }
  }
}

const debounceChangeHandler = debounce(changeHandler, 300)

const switchFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  if (isFullScreen.value) {
    nextTick(() => {
      openedFullScreenDialog()
    })
  }
}

const openedFullScreenDialog = () => {
  const dom = document.querySelector('.datav-fullscreen-editor > section') as HTMLElement
  if (dom) {
    const opts = Object.assign(
      {},
      defaultOpts,
      props.options,
      {
        tabSize: 2,
        value: '',
        language: props.language,
        theme: themeName,
        readOnly: props.readOnly,
        minimap: {
          enabled: props.useMinimap,
        },
        lineNumbers: props.lineNumbers,
        wordWrap: props.wordWrap,
      },
    )
    const ce = monaco.editor.create(dom, opts)

    ce.setValue(editor.getValue())
    if (props.autoFormat) {
      setTimeout(() => {
        formatDocument(ce, props.language)
      }, 1200)
    }

    ce.onDidChangeModelContent(() => debounceChangeHandler())
    ce.onDidBlurEditorText(() => blurHandler())

    fullEditor = ce
  }
}

const closedFullScreenDialog = () => {
  if (fullEditor) {
    if (editor && !props.readOnly) {
      editor.setValue(fullEditor.getValue())
      editor.focus()
    }

    fullEditor.dispose()
  }
}

watch(() => props.code, (nv: any) => {
  if (editor) {
    const inputCode = handleInputCode(props.language, nv)
    editor.setValue(inputCode)
  }
})

onMounted(async () => {
  const timer = setTimeout(() => { loading.value = true }, 200)
  monaco = await loader.init()
  clearTimeout(timer)
  loading.value = false

  registerDatavDarkTheme(monaco)
  registerApiCompletion(monaco, props.language, props.completions)

  await nextTick()

  const dom = document.getElementById(editorId)
  if (dom) {
    const opts = Object.assign(
      {},
      defaultOpts,
      props.options,
      {
        tabSize: 2,
        value: '',
        language: props.language,
        theme: themeName,
        readOnly: props.readOnly,
        minimap: {
          enabled: props.useMinimap,
        },
        lineNumbers: props.lineNumbers,
        wordWrap: props.wordWrap,
      },
    )

    const ce = monaco.editor.create(dom, opts)
    const inputCode = handleInputCode(props.language, props.code)
    ce.setValue(inputCode)
    if (props.autoFormat) {
      formatDocument(ce, props.language)
    }

    if (props.height > 0) {
      dom.style.height = `${props.height}px`
    }

    ce.onDidChangeModelContent(() => debounceChangeHandler())
    ce.onDidBlurEditorText(() => blurHandler())

    editor = ce
  }
})

onUnmounted(() => {
  editor?.dispose()
  fullEditor?.dispose()
})
</script>
