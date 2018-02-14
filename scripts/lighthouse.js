// @flow
const process = require('process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdirp = require('mkdirp');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator');

const failThreshold = require('../package.json').lighthouse.threshold;

const writeFile = promisify(fs.writeFile);

const server = require('./serve');

const BAD = 45;
const MEH = 75;

const app = (port /*: number */) => `http://localhost:${port}/interpro/`;

const AUDIT_ROOT = path.resolve('reports', 'lighthouse-audit');

const getColorFor = (score /*: number */) => {
  if (score < BAD) {
    return 'red';
  }
  if (score < MEH) {
    return 'yellow';
  }
  return 'green';
};

const renderScores = async results => {
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
  return average;
};

const chromeConfig = {
  chromePath: puppeteer.executablePath(),
  chromeFlags: [
    '--headless',
    '--disable-dev-shm-usage',
    // TODO: next two lines should eventually be removed, since they are not
    // TODO: recommended for security reasons
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
};

(async () => {
  let chrome;
  try {
    // setup
    const port = await server.start();
    if (!port) throw new Error("Server didn't start correctly");
    chrome = await chromeLauncher.launch(chromeConfig);
    // audit run
    // ignore 'artifacts' from results because it's not serializable;
    const { artifacts: _, ...results } = await require('lighthouse')(
      app(port),
      { port: chrome.port }
    );
    const average = await renderScores(results);
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
    try {
      if (chrome) await chrome.kill();
    } catch (_) {
      /**/
    }
    try {
      await server.close();
    } catch (_) {
      /**/
    }
    console.trace(error);
    process.exit(1);
  }
})();
