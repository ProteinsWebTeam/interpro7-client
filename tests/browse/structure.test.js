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

  const ExpectedElements = [
    '[data-testid="filters-panel"]',
    '[data-testid="filterby-experiment_type"]',
    '[data-testid="filterby-resolution_(å)"]',
    '[data-testid="view-table-button"]',
    '[data-testid="view-grid-button"]',
    '[data-testid="data-table"]',
  ];

  const NotExpectedElements = ['[data-testid="view-tree-button"]'];

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

  test('click-browse-page-structure-tab', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click entry tab
    await Promise.all([
      page.waitForSelector('[data-testid="browse-tab-structure"]', {
        timeout: 0,
      }),
      page.click('[data-testid="browse-tab-structure"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/structure/));
  });

  test('click-browse-page-structure-all-structures-filter', async () => {
    // initial navigation to structure browse page
    const browseURL = `${homepageURL}structure/PDB/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const allItems = 'all'; // 'all' is used as the memberdb name to represent 'all structures'
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-${allItems}"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-${allItems}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp('interpro/structure/PDB', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-structure-database-filters', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const databases = [...memberDatabases];
    databases.push(config.general.interpro);
    for (const db of databases) {
      // click member db filter
      await Promise.all([
        page.waitForSelector(`[data-testid="memberdb-filter-${db}"]`, {
          timeout: 0,
        }),
        page.click(`[data-testid="memberdb-filter-${db}"]`, {
          waitUntil: 'networkidle0',
        }),
      ]);
      const url = await page.evaluate(() => window.location.href);
      const urlMatch = new RegExp(
        `interpro\/structure\/PDB\/entry\/${db}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-structure-all-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'all';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-interpro-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = config.general.interpro;
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-cathgene3d-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cathgene3d';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-cdd-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cdd';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-hamap-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'hamap';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-panther-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-pfam-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pfam';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-pirsf-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pirsf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-prints-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prints';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-prodom-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prodom';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-profile-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'profile';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-prosite-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prosite';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-sfld-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'sfld';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-smart-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'smart';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-ssf-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'ssf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-tigrfams-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'tigrfams';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-structure-grid', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/pdb`;
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
    const urlMatch = new RegExp('interpro/structure/pdb/#grid', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
