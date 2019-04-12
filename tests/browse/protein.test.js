import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';
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
  ];

  const AllProteinsNotExpectedElements = ['[data-testid="view-tree-button"]'];

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

  test('click-browse-page-protein-tab', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-protein"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/protein/));
  });

  test('click-browse-page-protein-all-proteins-filter', async () => {
    // initial navigation to protein browse page
    const browseURL = `${homepage_url}protein/UniProt/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp('interpro/protein/UniProt', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-protein-database-filters', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const databases = config.general.member_databases;
    databases.push(config.general.interpro);
    for (const db of databases) {
      // click member db filter
      await Promise.all([
        page.click(`[data-testid="memberdb-filter-${db}"]`, {
          waitUntil: 'networkidle0',
        }),
      ]);
      const url = await page.evaluate(() => window.location.href);
      const urlMatch = new RegExp(
        `interpro\/protein\/UniProt\/entry\/${db}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-protein-all-proteins-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await pageElementTests(
      all_items,
      AllProteinsExpectedElements,
      AllProteinsNotExpectedElements
    );
  });

  test('click-browse-page-protein-cathgene3d-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cathgene3d';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-cdd-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'cdd';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-hamap-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'hamap';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-panther-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'panther';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-pfam-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'pfam';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-pirsf-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'pirsf';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-prints-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const db = 'prints';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-prodom-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'prodom';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-profile-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'profile';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-prosite-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'prosite';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-sfld-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'sfld';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-smart-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'smart';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-ssf-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'ssf';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-tigrfams-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const db = 'tigrfams';
    await pageElementTests(
      db,
      MemberDBExpectedElements,
      MemberDBNotExpectedElements
    );
  });

  test('click-browse-page-protein-grid', async () => {
    // initial navigation to browse page
    const browseURL = `${homepage_url}protein/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    await Promise.all([
      page.click('[data-testid="view-grid-button"]', {
        waitUntil: 'networkidle0',
      }),
    ]);
    const selection = await page.waitForSelector('[data-testid="data-grid"]');
    expect(selection).not.toBeNull();

    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp('interpro/protein/uniprot/#grid', 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });
});
