import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('HD1080Portait');
  let page;
  let homepage_url;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepage_url = await page.evaluate(() => window.location.href);
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
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    //click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-set"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/set/));
  });

  test('click-browse-page-set-all-set-filter', async () => {
    //initial navigation to set browse page
    const browseURL = `${homepage_url}set/all/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all sets'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/set\/all`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-set-database-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    //const databases = config.general.member_databases;
    //databases.push(config.general.interpro);
    const databases = ['cdd', 'pfam', 'pirsf'];
    for (const db of databases) {
      //click member db filter
      await Promise.all([
        page.click(`[data-testid="memberdb-filter-${db}"]`, {
          waitUntil: 'networkidle0',
        }),
      ]);
      const url = await page.evaluate(() => window.location.href);
      const urlMatch = new RegExp(`interpro\/set\/all\/entry\/${db}`, 'i');
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-taxonomy-all-taxonomy-filter', async () => {
    //initial navigation to taxonomy browse page
    const browseURL = `${homepage_url}set/all/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all taxonomies'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/taxonomy\/uniprot`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-taxonomy-database-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const databases = config.general.member_databases;
    databases.push(config.general.interpro);
    for (const db of databases) {
      //click member db filter
      await Promise.all([
        page.click(`[data-testid="memberdb-filter-${db}"]`, {
          waitUntil: 'networkidle0',
        }),
      ]);
      const url = await page.evaluate(() => window.location.href);
      const urlMatch = new RegExp(
        `interpro\/taxonomy\/uniprot\/entry\/${db}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-taxonomy-all-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'all';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-interpro-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'interpro';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-cathgene3d-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cathgene3d';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-cdd-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cdd';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-hamap-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'hamap';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-panther-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-pfam-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pfam';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-pirsf-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pirsf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-prints-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prints';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-prodom-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prodom';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-profile-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'profile';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-prosite-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prosite';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-sfld-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'sfld';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-smart-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'smart';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-ssf-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'ssf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-taxonomy-tigrfams-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}set/all`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'tigrfams';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });
});
