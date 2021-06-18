// https://commitlint.js.org/#/reference-rules
module.exports = {
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'ci', 'chore', 'revert'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-enum': [2, 'always', ['core', 'style', 'docs', 'dev', 'util', 'store', 'suspense']],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-min-length': [2, 'always', 3],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [2, 'always'],
  },
}
