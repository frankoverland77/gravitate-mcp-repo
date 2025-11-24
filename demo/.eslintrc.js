module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    // ============================================
    // FILE SIZE LIMITS (Prevents 1049-line files)
    // ============================================
    'max-lines': ['error', {
      max: 400,
      skipBlankLines: true,
      skipComments: true,
    }],
    'max-lines-per-function': ['error', {
      max: 150,
      skipBlankLines: true,
      skipComments: true,
    }],

    // ============================================
    // COMPLEXITY LIMITS
    // ============================================
    'complexity': ['error', { max: 15 }],
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 5],

    // ============================================
    // STYLE ENFORCEMENT (Prevents inline styles)
    // ============================================
    'react/forbid-dom-props': ['error', {
      forbid: ['style'],
    }],

    // ============================================
    // TYPESCRIPT QUALITY
    // ============================================
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for now
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-empty-function': 'warn',

    // ============================================
    // CODE QUALITY
    // ============================================
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],

    // ============================================
    // REACT BEST PRACTICES
    // ============================================
    'react/prop-types': 'off', // Using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/jsx-props-no-spreading': 'off', // Common pattern
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ============================================
    // IMPORT ORGANIZATION
    // ============================================
    'import/order': 'off', // Can enable later
    'sort-imports': 'off', // Can enable later
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'vite.config.js',
    '*.config.js',
  ],
};
