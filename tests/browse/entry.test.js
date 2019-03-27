import testInit from '../../scripts/test-init';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('QHD');
  let page;
  let homepage_url;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepage_url = await page.evaluate(() => window.location.href);
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
    //initial navigation to browse page
    const browseURL = `${homepage_url}structure/pdb`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    //click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-entry"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/entry/));
  });

  test('click-browse-page-entry-interpro-filter', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const interprodb = config.general.interpro;
    await Promise.all([
      page.click(`[data-testid="memberdb-filter-${interprodb}"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/entry\/${interprodb}`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-entry-member-db-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    for (const memberdb of config.general.member_databases) {
      //click member db filter
      await Promise.all([
        page.click(`[data-testid="memberdb-filter-${memberdb}"]`, {
          waitUntil: 'networkidle0',
        }),
      ]);
      const url = await page.evaluate(() => window.location.href);
      const urlMatch = new RegExp(`interpro\/entry\/${memberdb}`, 'i');
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-entry-interpro-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const interprodb = config.general.interpro;
    await pageElementTests(
      interprodb,
      InterProExpectedElements,
      InterProNotExpectedElements
    );
  });

  test('click-browse-page-entry-cathgene3d-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cathgene3d';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-cdd-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cdd';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-hamap-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'hamap';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-panther-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-panther-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-pfam-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pfam';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-pirsf-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pirsf';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-prints-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prints';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-prodom-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prodom';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-profile-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'profile';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-prosite-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prosite';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-sfld-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'sfld';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-smart-prints-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'smart';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-ssf-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'ssf';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-entry-tigrfams-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'tigrfams';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });
});
