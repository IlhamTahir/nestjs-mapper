module.exports = {
  types: [
    { type: 'feat', section: '✨ Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'perf', section: '⚡ Performance Improvements' },
    { type: 'revert', section: '⏪ Reverts' },
    { type: 'docs', section: '📚 Documentation' },
    { type: 'style', section: '💄 Styles' },
    { type: 'refactor', section: '♻️ Code Refactoring' },
    { type: 'test', section: '✅ Tests' },
    { type: 'build', section: '👷 Build System' },
    { type: 'ci', section: '🔧 Continuous Integration' },
    { type: 'chore', section: '🔨 Chores' },
  ],
  commitUrlFormat: 'https://github.com/ilhamtahir/nest-mapper/commit/{{hash}}',
  compareUrlFormat:
    'https://github.com/ilhamtahir/nest-mapper/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: 'https://github.com/ilhamtahir/nest-mapper/issues/{{id}}',
  userUrlFormat: 'https://github.com/{{user}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  issuePrefixes: ['#'],
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json',
    },
    {
      filename: 'packages/core/package.json',
      type: 'json',
    },
    {
      filename: 'packages/nestjs/package.json',
      type: 'json',
    },
  ],
};
