// https://stylelint.io/user-guide/configuration

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    "function-name-case": null,
    "font-family-no-missing-generic-family-keyword": null,
    "no-descending-specificity": null,
    "at-rule-semicolon-space-before": null,
    "block-no-empty": null,
    "at-rule-no-unknown": null,
    "selector-pseudo-class-no-unknown": null,
    "selector-pseudo-element-colon-notation": null,
    "color-hex-case": 'lower'
  }
};
