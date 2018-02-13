const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const mkdirp = require('mkdirp');

const buildInfo = require('./build-info');

const writeFile = promisify(fs.writeFile);

const REPORT_ROOT = path.resolve('report', 'build-report');

(async () => {
  mkdirp.sync(REPORT_ROOT);
  await writeFile(
    path.resolve(REPORT_ROOT, 'build-report.json'),
    JSON.stringify(buildInfo, null, 2)
  );
})();
