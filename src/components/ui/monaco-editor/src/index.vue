<template>
  <div
    :id="editorId"
    class="datav-editor"
    :class="[{
      '--read-only': readOnly,
    }]"
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
import * as monaco from 'monaco-editor'
import { debounce } from 'lodash-es'
import { generateId, copyText } from '@/utils/util'
import { MessageUtil } from '@/utils/message-util'
import { languageType, defaultOpts, registerDatavDarkTheme, registerApiCompletion, handleInputCode, formatDocument } from './editor-config'

export default defineComponent({
  name: 'GMonacoEditor',
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
    options: {
      type: Object,
      default: () => {},
    },
    completions: Array,
    extra: Object,
    height: {
      type: Number,
      default: 240,
    },
    fullScreenTitle: {
      type: String,
      default: '全屏模式',
    },
  },
  emits: ['change', 'blur'],
  setup(props, ctx) {
    const editorId = computed(() => `datav-editor-${generateId()}`)
    let editor = null as monaco.editor.IStandaloneCodeEditor | null
    let fullEditor = null as monaco.editor.IStandaloneCodeEditor | null

    const isFullScreen = ref(false)

    const themeName = registerDatavDarkTheme()
    registerApiCompletion(props.language, props.completions)

    const copyData = () => {
      if (editor) {
        copyText(editor.getValue())
        MessageUtil.success('复制成功')
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
        formatDocument(editor)
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
        formatDocument(ce)

        ce.onDidChangeModelContent(() => debounceChangeHandler())
        ce.onDidBlurEditorText(() => blurHandler())

        fullEditor = ce
      }
    }

    const closedFullScreenDialog = () => {
      if (fullEditor) {
        if (editor && !props.readOnly) {
          editor.setValue(fullEditor.getValue())
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
        formatDocument(ce)

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
      copyData,
      isFullScreen,
      switchFullScreen,
      openedFullScreenDialog,
      closedFullScreenDialog,
    }
  },
})
</script>
