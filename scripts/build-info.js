// @flow
const childProcess = require('child_process');

const branch /*: string */ = childProcess
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const commit /*: string */ = childProcess
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

let tag /*: ?string */ = null;
try {
  tag = childProcess
    .execSync(`git describe --exact-match ${commit}`, {
      stdio: ['pipe', 'pipe', 'ignore'],
    })
    .toString()
    .trim();
} catch (_) {
  // no tag for this commit
}
const time /*: number */ = Date.now();

module.exports = {
  git: { branch, commit, tag },
  build: { time },
};
