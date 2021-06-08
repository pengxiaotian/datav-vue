import * as monaco from 'monaco-editor'
import { isObject, isArray, isString } from '@/utils/util'

export type languageType = 'plaintext' | 'html' | 'javascript' | 'json' | 'sql'

export const defaultOpts: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  contextmenu: false,
  fixedOverflowWidgets: true,
  fontFamily: 'Menlo-Regular, Monaco, Menlo, Consolas, "Ubuntu Mono", monospace',
  formatOnPaste: true,
  formatOnType: true,
  insertSpaces: true,
  lineDecorationsWidth: 7,
  lineHeight: 15,
  lineNumbersMinChars: 3,
  minimap: {
    enabled: false,
  },
  quickSuggestions: false,
  readOnly: false,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
    alwaysConsumeMouseWheel: false,
    arrowSize: 0,
  },
  snippetSuggestions: 'none',
  tabSize: 2,
  theme: 'vs-dark',
  wordBasedSuggestions: false,
  wordWrap: 'on',
  cursorStyle: 'line',
  selectOnLineNumbers: true,
  autoIndent: 'advanced',
  glyphMargin: false,
  renderIndentGuides: true,
  renderLineHighlight: 'line',
  renderWhitespace: 'none',
  scrollBeyondLastColumn: 2,
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

  if (isObject(val) || isArray(val)) {
    val = JSON.stringify(val, null, 2)
  }

  return isString(val) ? val : `${val}`
}

export const formatDocument = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editor.getAction('editor.action.formatDocument').run()
}
