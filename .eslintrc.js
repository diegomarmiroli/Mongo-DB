module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: 'eslint:all',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    ignorePatterns: ['/node_modules', '.eslintrc.json', '.gitignore', 'package-lock.json', 'package.json'],
    rules: {
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'linebreak-style': 'off',
        'padded-blocks': ['error', 'never'],
        'eol-last': 'off',
        'id-length': 'off',
        'no-extra-parens': 'off',
        camelcase: 'off',

        'no-ternary': 'off',
        'multiline-ternary': 'off',
        'operator-linebreak': 'off',
        'no-negated-condition': 'off',
        curly: 'off',

        'one-var': 'off',
        'init-declarations': 'off',
        'prefer-const': 'off',
        'no-plusplus': 'off',

        'array-element-newline': 'off',

        'object-curly-spacing': 'off',
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'quote-props': 'off',
        'sort-keys': 'off',
        'prefer-destructuring': ['error', { object: true, array: false }],

        'lines-between-class-members': 'off',
        'max-params': 'off',

        'func-style': 'off',
        'func-names': 'off',
        'func-name-matching': 'off',
        'function-call-argument-newline': ['error', 'never'],
        'no-magic-numbers': 'off',
        'consistent-return': 'off',
        'space-before-function-paren': 'off',
        'newline-per-chained-call': ['error', { ignoreChainWithDepth: 5 }],
        'dot-location': ['error', 'property'],
        'max-statements': ['error', 20],

        'multiline-comment-style': 'off',
        'no-inline-comments': 'off',
        'line-comment-position': 'off',
        'capitalized-comments': 'off',

        'max-len': ['error', { code: 150 }],
        'no-console': 'off'
    }
};
