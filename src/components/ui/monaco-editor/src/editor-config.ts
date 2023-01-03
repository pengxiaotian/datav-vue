import type { editor as MEditor, languages, IRange } from 'monaco-editor'
import type { Monaco } from '@monaco-editor/loader'
import { isObject, isArray, isString } from 'lodash-es'

export type languageType = 'plaintext' | 'html' | 'javascript' | 'json' | 'sql'

export const defaultOpts: MEditor.IStandaloneEditorConstructionOptions = {
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
  guides: {
    indentation: true,
  },
  renderLineHighlight: 'line',
  renderWhitespace: 'none',
  scrollBeyondLastColumn: 2,
}

export const registerDatavDarkTheme = (monaco: Monaco) => {
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

type CompletionItem = languages.CompletionItem

let suggestLabels: string[] = []
const createSuggestions = (monaco: Monaco, range: IRange) => {
  const suggestions: CompletionItem[] = []
  for (let i = 0; i < suggestLabels.length; i++) {
    const id = suggestLabels[i]
    suggestions.push({
      label: `:${id}`,
      insertText: id,
      kind: monaco.languages.CompletionItemKind.Variable,
      detail: 'CallbackId',
      range,
    })
  }
  return suggestions
}

const registerCompletionMap = new Map()
export const registerApiCompletion = (monaco: Monaco, languageId: languageType, callbackIds: string[]) => {
  if (callbackIds && callbackIds.length > 0) {
    suggestLabels = callbackIds
    if (registerCompletionMap.has(languageId)) {
      return
    }
    registerCompletionMap.set(languageId, 1)

    monaco.languages.registerCompletionItemProvider(languageId, {
      triggerCharacters: [':'],
      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        return {
          suggestions: createSuggestions(monaco, range),
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

export const formatDocument = (editor: MEditor.IStandaloneCodeEditor, languageId: languageType) => {
  if (languageId === 'sql') {
    // todo
  } else {
    editor.getAction('editor.action.formatDocument').run()
  }
}
