import testInit, { memberDatabases } from '../../scripts/test-init';

import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('QHD');
  let page;
  let homepageURL;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepageURL = await page.evaluate(() => window.location.href);
  });

  afterAll(testSetup.cleanup);

  const InterProExpectedElements = [
    '[data-testid="filters-panel"]',
    '[data-testid="filterby-interpro_type"]',
    '[data-testid="filterby-integrated_database"]',
    '[data-testid="filterby-go_terms"]',
    '[data-testid="view-table-button"]',
    '[data-testid="view-grid-button"]',
    '[data-testid="data-table"]',
    '[data-testid="table-entity"]',
  ];

  const InterProNotExpectedElements = [
    '[data-testid="view-tree-button"]',
    '[data-testid="filterby-member_database_type"]',
    '[data-testid="filterby-interpro_state"]',
  ];

  const MemberDBExpectedElements = [
    '[data-testid="filters-panel"]',
    '[data-testid="filterby-member_database_type"]',
    '[data-testid="filterby-interpro_state"]',
    '[data-testid="view-table-button"]',
    '[data-testid="view-grid-button"]',
    '[data-testid="data-table"]',
  ];

  const MemberDBNotExpectedElements = [
    '[data-testid="view-tree-button"]',
    '[data-testid="filterby-interpro_type"]',
    '[data-testid="filterby-integrated_database"]',
    '[data-testid="filterby-go_terms"]',
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

  test('click-browse-page-entry-tab', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/pdb`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click entry tab
    await Promise.all([
      page.waitForSelector('[data-testid="browse-tab-entry"]', { timeout: 0 }),
      page.click('[data-testid="browse-tab-entry"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`${window.location.href}/entry/`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-entry-interpro-filter', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const interprodb = config.general.interpro;
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-${interprodb}"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-${interprodb}"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(
      `${window.location.href}\/entry\/${interprodb}`,
      'i'
    );
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  // loop over all member databases
  /* eslint-disable no-loop-func */
  const databases = [...memberDatabases];
  for (const memberdb of databases) {
    test(`click-browse-page-entry-${memberdb}-filters`, async () => {
      const browseURL = `${homepageURL}entry/interpro`;
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
        `${window.location.href}\/entry\/${memberdb}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    });

    test(`click-browse-page-entry-${memberdb}-page-elements`, async () => {
      // initial navigation to browse page
      const browseURL = `${homepageURL}entry/interpro`;
      await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

      await pageElementTests(
        memberdb,
        MemberDBExpectedElements,
        MemberDBNotExpectedElements
      );
    });
  }
  /* eslint-enable */

  test('click-browse-page-entry-interpro-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const interprodb = config.general.interpro;
    await pageElementTests(
      interprodb,
      InterProExpectedElements,
      InterProNotExpectedElements
    );
  });

  test('click-browse-page-entry-grid', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
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
    const urlMatch = new RegExp(
      `${window.location.href}/entry/interpro/#grid`,
      'i'
    );
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
