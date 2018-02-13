const process = require('process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdirp = require('mkdirp');
const chalk = require('chalk');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator');

const failThreshold = require('../package.json').lighthouse.threshold;

const writeFile = promisify(fs.writeFile);

const server = require('./serve');

const BAD = 45;
const MEH = 75;

const app = (port /*: number */) => `http://localhost:${port}/interpro/`;

const AUDIT_ROOT = path.resolve('report', 'lighthouse-audit');

const getColorFor = (score /*: number */) => {
  if (score < BAD) {
    return 'red';
  }
  if (score < MEH) {
    return 'yellow';
  }
  return 'green';
};

(async () => {
  try {
    // setup
    const port = await server.start();
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless'],
    });
    // audit run
    // ignore 'artifacts' from results because it's not serializable;
    const { artifacts: _, ...results } = await require('lighthouse')(
      app(port),
      { port: chrome.port }
    );
    let average = 0;
    console.log(chalk.blue.bold('Lighthouse audit'));
    for (const { name, score } of results.reportCategories) {
      average += score;
      console.log(
        '  ',
        chalk[getColorFor(score)](`${name}: ${Math.floor(score)}`)
      );
    }
    average /= results.reportCategories.length;
    console.log(
      chalk.blue.bold('Average score: '),
      chalk[getColorFor(average)].bold(Math.floor(average))
    );
    // save results
    mkdirp.sync(AUDIT_ROOT);
    await writeFile(
      path.resolve(AUDIT_ROOT, 'lighthouse-audit.json'),
      JSON.stringify(results, null, 2)
    );
    await writeFile(
      path.resolve(AUDIT_ROOT, 'lighthouse-audit.html'),
      new ReportGenerator().generateReportHtml(results)
    );
    // cleanup
    await chrome.kill();
    await server.close();
    if (average < failThreshold) {
      console.log(
        chalk.red.bold(
          `Average score of ${Math.floor(
            average
          )} is below acceptable level of ${failThreshold}`
        )
      );
      process.exit(1);
    }
  } catch (error) {
    console.trace(error);
    process.exit(1);
  }
})();
