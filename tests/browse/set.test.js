import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';
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

  test('click-browse-page-set-tab', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click entry tab
    await Promise.all([
      page.waitForSelector('[data-testid="browse-tab-set"]', { timeout: 0 }),
      page.click('[data-testid="browse-tab-set"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/set/));
  });

  test('click-browse-page-set-all-set-filter', async () => {
    // initial navigation to set browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const allItems = 'all'; // 'all' is used as the memberdb name to represent 'all sets'
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-all"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-all"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/set\/all`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-set-database-filters', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    //const databases = config.general.member_databases;
    //databases.push(config.general.interpro);
    const databases = ['cdd', 'pfam', 'pirsf'];
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
      const urlMatch = new RegExp(`interpro\/set\/all\/entry\/${db}`, 'i');
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-set-all-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'all';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-interpro-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'interpro';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-cathgene3d-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cathgene3d';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-cdd-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cdd';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-hamap-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'hamap';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-panther-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-pfam-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pfam';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-pirsf-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pirsf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-prints-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prints';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-prodom-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prodom';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-profile-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'profile';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-prosite-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prosite';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-sfld-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'sfld';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-smart-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'smart';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-ssf-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'ssf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-tigrfams-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'tigrfams';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-set-grid', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    await Promise.all([
      page.click(`[data-testid="view-grid-button"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const selection = await page.waitForSelector(`[data-testid="data-grid"]`);
    expect(selection).not.toBeNull();

    const item = await page.waitForSelector(`[data-testid="grid-entity"]`);
    expect(item).not.toBeNull();

    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/set\/all\/\#grid`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
