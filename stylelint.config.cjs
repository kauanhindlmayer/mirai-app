module.exports = {
  root: true,
  plugins: ['stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/html',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'no-descending-specificity': null,
    'no-empty-source': null,
    'font-family-no-missing-generic-family-keyword': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
          'extend',
          'content',
          'use',
        ],
      },
    ],
    'function-no-unknown': null,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'declaration-property-value-no-unknown': true,
    'selector-no-vendor-prefix': null,
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'value-no-vendor-prefix': null,
    'rule-empty-line-before': ['always', { ignore: ['after-comment', 'first-nested'] }],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
  overrides: [
    {
      files: ['**/*.(css|html|vue)'],
      customSyntax: 'postcss-html',
      rules: {
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep', 'global'] }],

        'selector-pseudo-element-no-unknown': [
          true,
          { ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'] },
        ],
      },
    },
  ],
}
