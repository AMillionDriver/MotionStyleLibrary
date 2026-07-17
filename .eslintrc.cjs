module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.css'],
      },
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'packages/axoloth-intellisense/out/',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.js'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '*.config.js',
          '*.config.cjs',
          'vite.config.js',
          '.eslintrc.cjs',
          'tests/**/*.js',
        ],
      },
    ],
    'linebreak-style': 'off',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['packages/axoloth-behavior/src/**/*.js'],
      rules: {
        'import/extensions': 'off',
      },
    },
    {
      files: ['vite.config.js'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
