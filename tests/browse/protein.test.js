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

  const MemberDBExpectedElements = [
    '[data-testid="filters-panel"]',
    '[data-testid="filterby-uniprot_curation"]',
    '[data-testid="filterby-taxonomy"]',
    '[data-testid="filterby-protein_size"]',
    '[data-testid="view-table-button"]',
    '[data-testid="view-grid-button"]',
    '[data-testid="data-table"]',
  ];

  const MemberDBNotExpectedElements = [
    '[data-testid="filterby-matching_entries"]',
    '[data-testid="view-tree-button"]',
  ];

  const AllProteinsExpectedElements = [
    '[data-testid="filters-panel"]',
    '[data-testid="filterby-matching_entries"]',
    '[data-testid="filterby-uniprot_curation"]',
    '[data-testid="filterby-taxonomy"]',
    '[data-testid="filterby-protein_size"]',
    '[data-testid="view-table-button"]',
    '[data-testid="view-grid-button"]',
    '[data-testid="data-table"]',
    '[data-testid="table-entity"]',
  ];

  const AllProteinsNotExpectedElements = ['[data-testid="view-tree-button"]'];

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

  test('click-browse-page-protein-tab', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click entry tab
    await Promise.all([
      page.waitForSelector('[data-testid="browse-tab-protein"]', {
        timeout: 0,
      }),
      page.click('[data-testid="browse-tab-protein"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/protein/));
  });

  test('click-browse-page-protein-all-proteins-filter', async () => {
    // initial navigation to protein browse page
    const browseURL = `${homepageURL}protein/UniProt/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const allItems = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-${allItems}"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-${allItems}"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp('interpro/protein/UniProt', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  // loop over all member databases
  /* eslint-disable no-loop-func */
  const databases = [...memberDatabases];
  databases.push(config.general.interpro);
  for (const memberdb of databases) {
    test(`click-browse-page-entry-${memberdb}-filters`, async () => {
      const browseURL = `${homepageURL}protein/UniProt/entry/InterPro`;
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
        `interpro\/protein\/UniProt\/entry\/${memberdb}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    });

    test(`click-browse-page-entry-${memberdb}-page-elements`, async () => {
      // initial navigation to browse page
      const browseURL = `${homepageURL}protein/UniProt/entry/InterPro`;
      await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

      await pageElementTests(
        memberdb,
        MemberDBExpectedElements,
        MemberDBNotExpectedElements
      );
    });
  }
  /* eslint-enable */

  test('click-browse-page-protein-all-proteins-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}protein/UniProt/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const allItems = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await pageElementTests(
      allItems,
      AllProteinsExpectedElements,
      AllProteinsNotExpectedElements
    );
  });

  test('click-browse-page-protein-grid', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}protein/uniprot`;
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
    const urlMatch = new RegExp('interpro/protein/uniprot/#grid', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
