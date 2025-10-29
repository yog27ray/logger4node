const importPlugin = require('eslint-plugin-import');
const { configs: jsConfigs } = require('@eslint/js');
const promisePlugin = require('eslint-plugin-promise');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const perfectionist = require('eslint-plugin-perfectionist'); // for deterministic import/object sorting

module.exports = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      '**/*.d.cts',
      '**/*.d.mts',
      './src/allocation-set',
    ],
  },
  jsConfigs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: { ...globals.node },
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      '@typescript-eslint': tsPlugin,
      perfectionist,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'] },
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...((tsPlugin.configs['recommended-type-checked'] || {}).rules || {}),
      ...((tsPlugin.configs['stylistic-type-checked'] || {}).rules || {}),
      ...((perfectionist.configs['recommended-natural'] || {}).rules || {}),
      '@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
      "@typescript-eslint/prefer-nullish-coalescing": [0],
      'max-len': ['error', 140],
      'promise/no-callback-in-promise': [0],
      '@typescript-eslint/no-unsafe-call': [0],
      'class-methods-use-this': [0],
      'import/prefer-default-export': [0],
      'key-spacing': 'error',
      'import/named': [0],
      'import/no-unresolved': [0],
      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'local',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      }],
      'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
      'import/extensions': ['error', 'ignorePackages', { 'js': 'never', 'jsx': 'never', 'ts': 'never', 'tsx': 'never' }]
    },
  },

  // Type declaration files: relax some checks
  {
    files: ['**/*.d.ts', '**/*.d.cts', '**/*.d.mts'],
    rules: {
      '@typescript-eslint/array-type': [0],
      '@typescript-eslint/no-namespace': [0],
      '@typescript-eslint/no-require-imports': [0],
      quotes: [0],
    },
  },

  // Tests
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '*.spec.ts', '*.test.ts', 'spec/test-logs.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'import/no-extraneous-dependencies': [0],
      'no-unused-expressions': [0],
      'max-classes-per-file': [0],
      'promise/no-callback-in-promise': [0],
      '@typescript-eslint/no-misused-promises': [0],
      '@typescript-eslint/no-unsafe-member-access': [0],
    },
  },
];
