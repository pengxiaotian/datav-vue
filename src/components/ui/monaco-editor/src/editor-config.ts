import * as monaco from 'monaco-editor'
import trim from 'lodash/trim'

export type languageType = 'plaintext' | 'html' | 'javascript' | 'json' | 'sql'

export const defaultOpts: monaco.editor.IStandaloneEditorConstructionOptions = {
  cursorStyle: 'line',
  selectOnLineNumbers: true,
  automaticLayout: false,
  autoIndent: 'advanced',
  glyphMargin: false,
  contextmenu: false,
  scrollbar: {
    alwaysConsumeMouseWheel: false,
    verticalSliderSize: 6,
    verticalScrollbarSize: 6,
  },
  lineNumbersMinChars: 3,
  renderIndentGuides: true,
  renderLineHighlight: 'line',
  renderWhitespace: 'none',
  scrollBeyondLastLine: false,
  scrollBeyondLastColumn: 2,
  lineHeight: 16,
}

export const registerDatavDarkTheme = () => {
  const themeName = 'datav-dark-theme'
  monaco.editor.defineTheme(themeName, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'key', foreground: 'dddddd' },
      { token: 'string.key.json', foreground: 'dddddd' },
      { token: 'string.value.json', foreground: 'b4e98c' },
    ],
    colors: {
      'editor.background': '#0e1013',
      'editor.lineHighlightBackground': '#1f2329',
      'editorLineNumber.foreground': '#576369',
      'editorCursor.foreground': '#2483ff',
    },
  })
  return themeName
}

type CompletionItem = monaco.languages.CompletionItem

export const registerApiCompletion = (languageId: languageType, callbackids?: any[]) => {
  if (languageId === 'plaintext' && callbackids) {
    monaco.languages.registerCompletionItemProvider(languageId, {
      triggerCharacters: [':'],
      provideCompletionItems() {
        const suggestions: CompletionItem[] = []
        for (let i = 0; i < callbackids.length; i++) {
          const id = callbackids[i]
          suggestions.push(<CompletionItem>{
            label: `:${id}`,
            insertText: id,
            kind: monaco.languages.CompletionItemKind.Variable,
            detail: 'callbackid',
          })
        }
        return {
          suggestions,
        }
      },
    })
  }
}

export const handleInputCode = (languageId: languageType, code: string | any[] | object) => {
  let val = code
  if (languageId === 'json') {
    if (typeof val === 'string') {
      val = JSON.parse(trim(val, '"\''))
    }

    return JSON.stringify(val, null, 2)
  }

  if (typeof val !== 'string') {
    val = JSON.stringify(val, null, 2)
  }

  if (languageId === 'javascript') {
    return val || 'return data;'
  }

  return val
}
