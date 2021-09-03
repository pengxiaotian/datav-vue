<template>
  <AsyncLoading v-if="loading" />
  <div
    :id="editorId"
    class="datav-editor"
    :class="[{
      '--read-only': readOnly,
    }, editorClass]"
  >
    <div class="datav-editor-actions">
      <i
        class="v-icon-copy action-btn"
        title="点击复制"
        @click="copyData"
      ></i>
      <i
        class="action-btn"
        :class="isFullScreen ? 'v-icon-fullscreen-exit' : 'v-icon-fullscreen'"
        :title="isFullScreen ? '退出全屏' : '全屏模式下编辑或查看'"
        @click="switchFullScreen"
      ></i>
    </div>
  </div>

  <el-dialog
    v-model="isFullScreen"
    :title="`${fullScreenTitle}${readOnly ? ' ( 只读 )' : ''}`"
    width="90%"
    top="0"
    custom-class="fullscreen-editor-dialog"
    :destroy-on-close="true"
    :append-to-body="true"
    @opened="openedFullScreenDialog"
    @closed="closedFullScreenDialog"
  >
    <div class="fullscreen-editor-wp">
      <div
        class="datav-editor fullscreen-editor"
        :class="[{
          '--read-only': readOnly,
        }]"
      >
        <section style="display: flex; position: relative; text-align: initial; width: 100%; height: 100%;"></section>
      </div>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent, computed, nextTick, onMounted, onUnmounted, ref, PropType, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useMessage } from 'naive-ui'
import loader from '@monaco-editor/loader'
import type { editor as MEditor } from 'monaco-editor'
import { generateId, copyText } from '@/utils/util'
import AsyncLoading from '@/components/ui/loading/src/async-loading.vue'
import { languageType, defaultOpts, registerDatavDarkTheme, registerApiCompletion, handleInputCode, formatDocument, Monaco } from './editor-config'


loader.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.27.0/min/vs' } })

export default defineComponent({
  name: 'GMonacoEditor',
  components: {
    AsyncLoading,
  },
  props: {
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
      type: Object,
      default: () => {},
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
  },
  emits: ['change', 'blur'],
  setup(props, ctx) {
    const nMessage = useMessage()
    const loading = ref(false)
    const editorId = computed(() => `datav-editor-${generateId()}`)
    let monaco = null as Monaco | null
    let editor = null as MEditor.IStandaloneCodeEditor | null
    let fullEditor = null as MEditor.IStandaloneCodeEditor | null
    const themeName = 'datav-dark-theme'

    const isFullScreen = ref(false)

    const copyData = () => {
      if (editor) {
        copyText(editor.getValue())
        nMessage.success('复制成功')
      }
    }

    const changeHandler = () => {
      if (editor) {
        const value = editor.getValue()
        ctx.emit('change', {
          value,
          extra: props.extra,
        })
      }
    }
    const blurHandler = () => {
      if (editor) {
        const value = editor.getValue()
        ctx.emit('blur', {
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
    }

    const openedFullScreenDialog = () => {
      const dom = document.querySelector('.fullscreen-editor > section') as HTMLElement
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
          formatDocument(ce, props.language)
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

      const dom = document.getElementById(editorId.value)
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

    return {
      editorId,
      isFullScreen,
      loading,
      copyData,
      switchFullScreen,
      openedFullScreenDialog,
      closedFullScreenDialog,
    }
  },
})
</script>
