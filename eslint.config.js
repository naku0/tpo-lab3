import js from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node.js
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        // Jest
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        // Allure
        allure: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': ['off'],
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['**/*.spec.js', '**/*.test.js', 'tests/**/*.js'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.log',
      '.idea/',
      'allure-report/',
      'allure-report-chrome/',
      'allure-report-firefox/',
      'allure-results/',
      'allure-results-chrome/',
      'allure-results-firefox/',
    ],
  },
];
