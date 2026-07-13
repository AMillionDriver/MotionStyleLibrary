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
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/'],
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
        devDependencies: ['*.config.js', '*.config.cjs', 'vite.config.js', '.eslintrc.cjs'],
      },
    ],
    'linebreak-style': 'off',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['vite.config.js'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
