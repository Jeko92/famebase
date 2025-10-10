module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type enum
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'release',
        'revert',
        'security',
        'style',
        'test',
      ],
    ],
    // Scope enum
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'database',
        'ui',
        'config',
        'deps',
        'influencers',
        'campaigns',
        'api',
        'auth',
        'images',
      ],
    ],
    // Subject case
    'subject-case': [2, 'always', 'lower-case'],
    // Subject empty
    'subject-empty': [2, 'never'],
    // Subject full stop
    'subject-full-stop': [2, 'never', '.'],
    // Type case
    'type-case': [2, 'always', 'lower-case'],
    // Type empty
    'type-empty': [2, 'never'],
    // Scope case
    'scope-case': [2, 'always', 'lower-case'],
    // Body leading blank
    'body-leading-blank': [2, 'always'],
    // Footer leading blank
    'footer-leading-blank': [2, 'always'],
    // Header max length
    'header-max-length': [2, 'always', 72],
  },
};