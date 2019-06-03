import testInit, { memberDatabases } from '../../scripts/test-init';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('HD1080Portait');
  let page;
  let homepageURL;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepageURL = await page.evaluate(() => window.location.href);
  });

  afterAll(testSetup.cleanup);

  const ExpectedElements = [
    '[data-testid="view-table-button"]',
    '[data-testid="view-grid-button"]',
    '[data-testid="data-table"]',
  ];

  const NotExpectedElements = [
    '[data-testid="filters-panel"]',
    '[data-testid="view-tree-button"]',
  ];

  const pageElementTests = async (
    clickFilter,
    expectedElements,
    notExpectedElements
  ) => {
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-${clickFilter}"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-${clickFilter}"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);

    for (const selector of expectedElements) {
      const selection = await page.waitForSelector(selector);
      expect(selection).not.toBeNull();
    }
    for (const selector of notExpectedElements) {
      const selection = await checkForElement(page, selector);
      expect(selection).toMatch('TimeoutError');
    }
  };

  test('click-browse-page-proteome-tab', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click entry tab
    await Promise.all([
      page.waitForSelector('[data-testid="browse-tab-proteome"]', {
        timeout: 0,
      }),
      page.click('[data-testid="browse-tab-proteome"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/proteome/));
  });

  test('click-browse-page-proteome-all-proteome-filter', async () => {
    // initial navigation to proteome browse page
    const browseURL = `${homepageURL}proteome/uniprot/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const allItems = 'all'; // 'all' is used as the memberdb name to represent 'all proteomes'
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-${allItems}"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-${allItems}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp('interpro/proteome/uniprot', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  // loop over all member databases
  /* eslint-disable no-loop-func */
  const databases = [...memberDatabases];
  databases.push(config.general.interpro);
  for (const memberdb of databases) {
    test(`click-browse-page-entry-${memberdb}-filters`, async () => {
      const browseURL = `${homepageURL}proteome/uniprot`;
      await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
      // click member db filter
      await Promise.all([
        page.waitForSelector(`[data-testid="memberdb-filter-${memberdb}"]`, {
          timeout: 0,
        }),
        page.click(`[data-testid="memberdb-filter-${memberdb}"]`, {
          waitUntil: 'networkidle0',
        }),
      ]);
      const url = await page.evaluate(() => window.location.href);
      const urlMatch = new RegExp(
        `interpro\/proteome\/uniprot\/entry\/${memberdb}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    });

    test(`click-browse-page-entry-${memberdb}-page-elements`, async () => {
      // initial navigation to browse page
      const browseURL = `${homepageURL}proteome/uniprot`;
      await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

      await pageElementTests(memberdb, ExpectedElements, NotExpectedElements);
    });
  }
  /* eslint-enable */

  test('click-browse-page-proteome-all-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'all';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-grid', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    await Promise.all([
      page.waitForSelector('[data-testid="view-grid-button"]', { timeout: 0 }),
      page.click('[data-testid="view-grid-button"]', {
        waitUntil: 'networkidle0',
      }),
    ]);
    const selection = await page.waitForSelector('[data-testid="data-grid"]');
    expect(selection).not.toBeNull();

    const item = await page.waitForSelector('[data-testid="grid-entity"]');
    expect(item).not.toBeNull();

    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp('interpro/proteome/uniprot/#grid', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
