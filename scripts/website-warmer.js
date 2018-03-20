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
const memberDBLinksSelector = '.pp-memberdb-links a';

const swipeFilter = async (page, selector, execute = null) => {
  const len = (await page.$$(selector)).length;
  for (let i = 0; i < len; i++) {
    const option = (await page.$$(selector))[i];
    await page.waitFor(oneSec);
    if (option) {
      await option.click();
      if (execute) await execute(option);
    }
  }
  if (len) {
    const first = (await page.$$(selector))[0];
    if (first) first.click();
  }
};
const checkEntryBrowse = async page => {
  const selector = 'a[href="/interpro/entry/cdd/"]';
  console.log(`  Click on tab Entry and looking for ${selector}`);
  await page.waitForSelector(selector);
  await page.waitForSelector(memberDBLinksSelector);
  const memberDBLinks = await page.$$(memberDBLinksSelector);
  for (const link of memberDBLinks) {
    const linkTitle = await page.evaluate(t => t.innerText, link);
    await page.waitFor(oneSec);
    await link.click();
    console.log(`    Click on tab ${linkTitle} `);
    await swipeFilter(page, '.list-entries input', async option => {
      const txt1 = await page.evaluate(t => t.value, option);
      await swipeFilter(page, '.list-sign input', async option2 => {
        const txt2 = await page.evaluate(t => t.value, option2);
        await swipeFilter(page, '.list-go input', async option3 => {
          const txt3 = await page.evaluate(t => t.value, option3);
          console.log(`      Filter: ${txt1}-${txt2}-${txt3}`);
        });
      });
      await swipeFilter(page, '.list-integrated input', async option2 => {
        const txt2 = await page.evaluate(t => t.value, option2);
        console.log(`      Filter: ${txt1}-${txt2}`);
      });
    });
  }
};
const checkProteinBrowse = async page => {
  const selector = 'a[href="/interpro/protein/UniProt/"]';
  console.log(`  Click on tab Protein and looking for ${selector}`);
  await page.waitForSelector(selector);
  const memberDBLinks = await page.$$(memberDBLinksSelector);
  for (const link of memberDBLinks) {
    const linkTitle = await page.evaluate(t => t.innerText, link);
    await page.waitFor(oneSec);
    await link.click();
    console.log(`    Click on tab ${linkTitle} `);
    await swipeFilter(page, '.list-curation input', async option => {
      const txt1 = await page.evaluate(t => t.value, option);
      await swipeFilter(page, '.list-taxonomy input', async option2 => {
        const txt2 = await page.evaluate(t => t.value, option2);
        await swipeFilter(page, '.list-length input', async option3 => {
          const txt3 = await page.evaluate(t => t.value, option3);
          console.log(`      Filter: ${txt1}-${txt2}-${txt3}`);
        });
      });
    });
  }
};
const checkStructureBrowse = async page => {
  const selector = 'a[href="/interpro/structure/PDB/"]';
  console.log(`  Click on tab Structure and looking for ${selector}`);
  await page.waitForSelector(selector);
  const memberDBLinks = await page.$$(memberDBLinksSelector);
  for (const link of memberDBLinks) {
    const linkTitle = await page.evaluate(t => t.innerText, link);
    await page.waitFor(oneSec);
    await link.click();
    console.log(`    Click on tab ${linkTitle} `);
    await swipeFilter(page, '.list-experiment input', async option => {
      const txt1 = await page.evaluate(t => t.value, option);
      console.log(`      Filter: ${txt1}`);
    });
  }
};
const checkSetBrowse = async page => {
  const selector = 'a[href="/interpro/set/all/"]';
  console.log(`  Click on tab Set and looking for ${selector}`);
  await page.waitForSelector(selector);
  const memberDBLinks = await page.$$(memberDBLinksSelector);
  for (const link of memberDBLinks) {
    const linkTitle = await page.evaluate(t => t.innerText, link);
    await page.waitFor(oneSec);
    await link.click();
    console.log(`    Click on tab ${linkTitle} `);
  }
};
const checkOrganismBrowse = async page => {
  const selector = 'a[href="/interpro/organism/taxonomy/"]';
  console.log(`  Click on tab Organism and looking for ${selector}`);
  await page.waitForSelector(selector);
  const memberDBLinks = await page.$$(memberDBLinksSelector);
  for (const link of memberDBLinks) {
    const linkTitle = await page.evaluate(t => t.innerText, link);
    await page.waitFor(oneSec);
    await link.click();
    console.log(`    Click on tab ${linkTitle} `);
    await swipeFilter(page, '.list-organism-type input', async option => {
      const txt1 = await page.evaluate(t => t.value, option);
      console.log(`      Filter: ${txt1}`);
    });
  }
};
const checkBrowseSubsection = {
  // Entry: checkEntryBrowse,
  Protein: checkProteinBrowse,
  Structure: checkStructureBrowse,
  Set: checkSetBrowse,
  Organism: checkOrganismBrowse,
};
const checkBrowseSection = async page => {
  await page.waitForSelector(browseTabsSelector);
  const browseLinks = await page.$$(browseTabsSelector);
  for (const tab of browseLinks) {
    const tabTitle = await page.evaluate(t => t.innerText, tab);
    await tab.click();
    // TODO: clicking twice to give time to the scrolling, otherwise the click won't be captured
    await page.waitFor(oneSec);
    await tab.click();
    if (checkBrowseSubsection[tabTitle])
      await checkBrowseSubsection[tabTitle](page);
  }
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
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
