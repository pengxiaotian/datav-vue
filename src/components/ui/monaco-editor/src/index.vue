<template>
  <div
    :id="editorId"
    class="datav-editor"
    :class="[{
      '--read-only': readOnly,
      '--is-fullscreen': isFullScreen
    }]"
  >
    <div v-if="isFullScreen" class="datav-editor-title">
      全屏模式
    </div>
    <div class="datav-editor-actions">
      <i
        class="v-icon-copy action-btn"
        title="点击复制"
        @click="copyData"
      ></i>
      <i
        class="action-btn"
        :class="isFullScreen ? 'v-icon-fullscreen-exit' : 'v-icon-fullscreen'"
        title="全屏模式下编辑或查看"
        @click="switchFullScreen"
      ></i>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, nextTick, onMounted, onUnmounted, ref, PropType, watch } from 'vue'
import * as monaco from 'monaco-editor'
import debounce from 'lodash/debounce'
import { generateId, copyText } from '@/utils/util'
import { MessageUtil } from '@/utils/message-util'
import { languageType, defaultOpts, registerDatavDarkTheme, registerApiCompletion, handleInputCode } from './editor-config'

export default defineComponent({
  name: 'GMonacoEditor',
  props: {
    language: {
      type: String as PropType<languageType>,
      default: 'javascript',
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
  },
  emits: ['change', 'blur'],
  setup(props, ctx) {
    const editorId = computed(() => `datav-editor-${generateId()}`)
    let editor = null as monaco.editor.IStandaloneCodeEditor | null

    const isFullScreen = ref(false)

    const themeName = registerDatavDarkTheme()
    registerApiCompletion(props.language, props.completions)

    const copyData = () => {
      if (editor) {
        copyText(editor.getValue())
        MessageUtil.success('复制成功')
      }
    }

    const switchFullScreen = () => {
      isFullScreen.value = !isFullScreen.value
      if (editor) {
        if (isFullScreen.value) {
          editor.layout({
            width: document.documentElement.offsetWidth - 36,
            height: document.documentElement.offsetHeight - 60,
          })
        } else {
          const dom = document.getElementById(editorId.value)?.parentElement
          if (dom) {
            editor.layout({
              width: dom.offsetWidth - 16,
              height: props.height,
            })
          }
        }
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
      }
    }

    const debounceChangeHandler = debounce(changeHandler, 300)

    watch(() => props.code, (nv: any) => {
      if (editor) {
        const inputCode = handleInputCode(props.language, nv)
        editor.setValue(inputCode)
      }
    }, {
      deep: true,
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

        ce.layout({
          width: (dom.parentElement || dom).offsetWidth - 16,
          height: props.height,
        })

        ce.onDidChangeModelContent(() => debounceChangeHandler())
        ce.onDidBlurEditorText(() => blurHandler())
        ce.onKeyDown(() => {
          if (props.readOnly) {
            MessageUtil.warning('当前数据为只读不可编辑')
          }
        })
        editor = ce
      }
    })

    onUnmounted(() => {
      editor?.dispose()
    })

    return {
      editorId,
      copyData,
      isFullScreen,
      switchFullScreen,
    }
  },
})
</script>
