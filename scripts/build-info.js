const childProcess = require('child_process');

const pkg = require('../package.json');

const branch = childProcess
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const commit = childProcess
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

let tag = null;
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

module.exports = {
  git: { branch, commit, tag },
  build: { time: Date.now() },
  pkg,
};
