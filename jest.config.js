/* eslint-env node */
const fs = require('fs');

const url = require('url');
const yaml = require('js-yaml');

// Use config example here for tests, because it's version-controlled
const iprConfig = yaml.safeLoad(fs.readFileSync('config.yml.example', 'utf8'));
const websiteURL = url.parse(iprConfig.root.website, true, true);

module.exports = {
  verbose: false,
  moduleNameMapper: {
    'config.yml$': '<rootDir>/interpro-config.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['src/**/*.js', '!**/.*.js'],
  coverageReporters: ['json-summary', 'lcov', 'text-summary'],
  coverageDirectory: 'reports/jest-coverage',
  transformIgnorePatterns: ['node_modules/(?!lodash-es|timing-functions|gsap)'],
  testURL: websiteURL.href,
};
