'use strict';

const puppeteer = require('puppeteer');
const oneSec = 1000;

const tabLinksSelector = '.browse-by .tabs-title button';
const browseTabsSelectors = {
  'Member Database': 'a[href="/interpro/entry/prints/"]',
  'Entry type': 'a[href="/interpro/entry/InterPro/?type=domain"]',
  Species: 'a[href="/interpro/organism/taxonomy/39947/entry/all/"]',
  'GO term': 'a[href="/interpro/entry/InterPro/?go_term=GO%3A0003824"]',
};

const checkHomePage = async page => {
  await page.waitForSelector(tabLinksSelector);
  const browseTabsLinks = await page.$$(tabLinksSelector);
  for (const tab of browseTabsLinks) {
    const tabTitle = await page.evaluate(t => t.innerHTML, tab);
    await page.waitFor(oneSec);
    await tab.click();
    console.log(
      `  Click on tab ${tabTitle} and looking for ${
        browseTabsSelectors[tabTitle]
      }`
    );
    await page.waitForSelector(browseTabsSelectors[tabTitle]);
  }
};

const browseTabsSelector = '.pp-browse-tabs li a';
const checkEntryBrowse = async page => {
  const selector = 'a[href="/interpro/entry/cdd/"]';
  console.log(`  Click on tab Entry and looking for ${selector}`);
  await page.waitForSelector(selector);
};
const checkProteinBrowse = async page => {
  const selector = 'a[href="/interpro/protein/UniProt/"]';
  console.log(`  Click on tab Protein and looking for ${selector}`);
  await page.waitForSelector(selector);
};
const checkStructureBrowse = async page => {
  const selector = 'a[href="/interpro/structure/PDB/"]';
  console.log(`  Click on tab Structure and looking for ${selector}`);
  await page.waitForSelector(selector);
};
const checkSetBrowse = async page => {
  const selector = 'a[href="/interpro/set/all/"]';
  console.log(`  Click on tab Set and looking for ${selector}`);
  await page.waitForSelector(selector);
};
const checkOrganismBrowse = async page => {
  const selector = 'a[href="/interpro/organism/taxonomy/"]';
  console.log(`  Click on tab Organism and looking for ${selector}`);
  await page.waitForSelector(selector);
};
const checkBrowseSubsection = {
  Entry: checkEntryBrowse,
  Protein: checkProteinBrowse,
  Structure: checkStructureBrowse,
  Set: checkSetBrowse,
  Organism: checkOrganismBrowse,
};
const checkBrowseSection = async page => {
  await page.waitForSelector(browseTabsSelector);
  const browseLinks = await page.$$(browseTabsSelector);
  for (const tab of browseLinks) {
    const tabTitle = await page.evaluate(t => t.innerHTML, tab);
    await page.waitFor(oneSec);
    await tab.click();
    await checkBrowseSubsection[tabTitle](page);
  }
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000/interpro/');

  const mainMenuSelector = '.masthead .menu a';
  const titleSelector = `${mainMenuSelector}.active`;

  // Wait for suggest overlay to appear and click "show all results".
  await page.waitForSelector(mainMenuSelector);
  const mainLinks = await page.$$(mainMenuSelector);

  const checkSection = {
    Home: checkHomePage,
    Browse: checkBrowseSection,
  };

  for (const link of mainLinks) {
    await link.click();
    await page.waitForSelector(titleSelector);
    const title = await page.$$eval(titleSelector, t => t[0].innerHTML);
    console.log(`Exploring ${title}`);
    if (checkSection[title]) {
      await checkSection[title](page);
    }
  }

  await browser.close();
})();
