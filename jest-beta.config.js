/* eslint-env node */

module.exports = {
  verbose: false,
  moduleNameMapper: {
    'config.yml$': '<rootDir>/interpro-config.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|tmpl|fasta)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^taxonomy-visualisation(.*)$':
      '<rootDir>/node_modules/taxonomy-visualisation/src/$1',
    '^protvista-([^/]*)(.*)$': '<rootDir>/node_modules/protvista-$1/src/$2',
  },
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['src/**/*.js', '!**/.*.js'],
  coverageReporters: ['json-summary', 'lcov', 'text-summary'],
  coverageDirectory: 'reports/jest-coverage',
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|timing-functions|gsap|taxonomy-visualisation|protvista|react-syntax-highlighter)',
  ],
  testURL: 'https://www.ebi.ac.uk/interpro/beta',
};
