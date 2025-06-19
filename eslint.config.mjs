import { defineConfig } from 'eslint/config';
// import eslint from '@eslint/js';
// import tseslint from 'typescript-eslint';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  // recommendedConfig: tseslint.configs.recommended,
  // allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: [
      'node_modules/**/*',
      '.next/**/*',
      '.git/**/*',
      '.amplify/**/*',
      'amplify_outputs*',
      'amplifyconfiguration*',
      'modernize-template/**/*',
      'modernize/**/*',
      'template/**/*',
      'dist/**/*',
      'out/**/*',
      '*.tsbuildinfo',
      'build/**/*',
      'coverage/**/*',
    ],
  },
  {
    extends: compat.extends('next/core-web-vitals', 'next', 'plugin:prettier/recommended'),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/prefer-default-export': 'error',

      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          singleAttributePerLine: true,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],
    },
  },
  {
    files: ['amplify/**/*'],
    rules: {
      'import/prefer-default-export': 'off',
    },
  },
  {
    files: ['amplify/functions/**/*'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]);
