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
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    //click entry tab
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
    //initial navigation to proteome browse page
    const browseURL = `${homepage_url}proteome/uniprot/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteomes'
    await Promise.all([
      page.waitForSelector(`[data-testid="memberdb-filter-${all_items}"]`, {
        timeout: 0,
      }),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/proteome\/uniprot`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-proteome-database-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const databases = config.general.member_databases;
    databases.push(config.general.interpro);
    for (const db of databases) {
      //click member db filter
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
        `interpro\/proteome\/uniprot\/entry\/${db}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-proteome-all-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'all';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-interpro-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'interpro';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-cathgene3d-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cathgene3d';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-cdd-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cdd';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-hamap-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'hamap';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-panther-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-pfam-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pfam';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-pirsf-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pirsf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-prints-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prints';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-prodom-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prodom';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-profile-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'profile';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-prosite-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prosite';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-sfld-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'sfld';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-smart-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'smart';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-ssf-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'ssf';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-tigrfams-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'tigrfams';
    await pageElementTests(db, ExpectedElements, NotExpectedElements);
  });

  test('click-browse-page-proteome-grid', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    await Promise.all([
      page.waitForSelector(`[data-testid="view-grid-button"]`, { timeout: 0 }),
      page.click(`[data-testid="view-grid-button"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const selection = await page.waitForSelector(`[data-testid="data-grid"]`);
    expect(selection).not.toBeNull();

    const item = await page.waitForSelector(`[data-testid="grid-entity"]`);
    expect(item).not.toBeNull();

    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/proteome\/uniprot\/\#grid`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
