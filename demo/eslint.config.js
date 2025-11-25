import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Prettier (disables conflicting rules)
  prettier,

  // Global ignores
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'vite.config.js', '*.config.js'],
  },

  // Main config for TypeScript/React files
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ============================================
      // FILE SIZE LIMITS (Prevents 1049-line files)
      // ============================================
      'max-lines': [
        'error',
        {
          max: 400,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // ============================================
      // COMPLEXITY LIMITS
      // ============================================
      complexity: ['error', { max: 15 }],
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 5],

      // ============================================
      // STYLE ENFORCEMENT (Prevents inline styles)
      // ============================================
      'react/forbid-dom-props': [
        'error',
        {
          forbid: ['style'],
        },
      ],

      // ============================================
      // TYPESCRIPT QUALITY
      // ============================================
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',

      // ============================================
      // CODE QUALITY
      // ============================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],

      // ============================================
      // REACT BEST PRACTICES
      // ============================================
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }
);
