/* eslint-env node */
const fs = require('fs');

const url = require('url');
const yaml = require('js-yaml');

// Use config example here for tests, because it's version-controlled
const iprConfig = yaml.load(fs.readFileSync('config.yml.example', 'utf8'));
const websiteURL = url.parse(iprConfig.root.website, true, true);

module.exports = {
  verbose: false,
  moduleNameMapper: {
    'config.yml$': '<rootDir>/interpro-config.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|tmpl|fasta|avif)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^taxonomy-visualisation(.*)$':
      '<rootDir>/node_modules/taxonomy-visualisation/src/$1',
    '^d3-([^/]*)(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js',
  },
  preset: 'ts-jest/presets/js-with-babel',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['src/**/*.js', '!**/.*.js'],
  coverageReporters: ['json-summary', 'lcov', 'text-summary'],
  coverageDirectory: 'reports/jest-coverage',
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es|timing-functions|taxonomy-visualisation|protvista|react-syntax-highlighter|@nightingale)',
  ],
  testEnvironmentOptions: {
    url: websiteURL.href,
  },
  testEnvironment: 'jsdom',
};
