import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';
import config from '../test_config';

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

  test('browse-page-tabs', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    //check presence of browse type buttons
    for (const type of config.browse.browse_types) {
      const selection = await page.waitForSelector(
        `[data-testid="browse-tab-${type}"]`,
        { timeout: 3000 }
      );
      expect(selection).not.toBeNull();
    }
  });

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
    await Promise.all([
      page.click(`[data-testid="memberdb-filter-${interprodb}"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const selection = await page.waitForSelector(
      '[data-testid="filters-panel"]'
    );
    expect(selection).not.toBeNull();
    const interpro_type = await page.waitForSelector(
      '[data-testid="filterby-interpro_type"]'
    );
    expect(interpro_type).not.toBeNull();
    const integrated_database = await page.waitForSelector(
      '[data-testid="filterby-integrated_database"]'
    );
    expect(integrated_database).not.toBeNull();
    const go_terms = await page.waitForSelector(
      '[data-testid="filterby-go_terms"]'
    );
    expect(go_terms).not.toBeNull();
    const table_selector = await page.waitForSelector(
      '[data-testid="view-table-button"]'
    );
    expect(table_selector).not.toBeNull();
    const grid_selector = await page.waitForSelector(
      '[data-testid="view-grid-button"]'
    );
    expect(grid_selector).not.toBeNull();
    //the default view is tabular
    const data_table = await page.waitForSelector('[data-testid="data-table"]');
    expect(data_table).not.toBeNull();
  });

  test('click-browse-page-entry-member-db-page-elements', async () => {
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
      const selection = await page.waitForSelector(
        '[data-testid="filters-panel"]'
      );
      expect(interpro_type).not.toBeNull();
      const member_database_type = await page.waitForSelector(
        '[data-testid="filterby-member_database_type"]'
      );
      expect(member_database_type).not.toBeNull();
      const interpro_state = await page.waitForSelector(
        '[data-testid="filterby-interpro_state"]'
      );
      expect(interpro_state).not.toBeNull();
      const table_selector = await page.waitForSelector(
        '[data-testid="view-table-button"]'
      );
      expect(table_selector).not.toBeNull();
      const grid_selector = await page.waitForSelector(
        '[data-testid="view-grid-button"]'
      );
      expect(grid_selector).not.toBeNull();
      const tree_selector = await page.waitForSelector(
        '[data-testid="view-tree-button"]'
      );
      expect(tree_selector).toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
    }
  });

  test('click-browse-page-protein-tab', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    //click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-protein"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/protein/));
  });

  test('click-browse-page-protein-all-proteins-filter', async () => {
    //initial navigation to protein browse page
    const browseURL = `${homepage_url}protein/UniProt/entry/InterPro`;
    const all_proteins = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_proteins}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/protein\/UniProt`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-protein-database-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
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
        `interpro\/protein\/UniProt\/entry\/${db}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-protein-all-proteins-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const all_proteins = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.click(`[data-testid="memberdb-filter-${all_proteins}"]`, {
        waitUntil: 'networkidle0',
      }),
    ]);
    const selection = await page.waitForSelector(
      '[data-testid="filters-panel"]'
    );
    expect(selection).not.toBeNull();
    const matching_entries = await page.waitForSelector(
      '[data-testid="filterby-matching_entries"]'
    );
    expect(matching_entries).not.toBeNull();
    const uniprot_curation = await page.waitForSelector(
      '[data-testid="filterby-uniprot_curation"]'
    );
    expect(uniprot_curation).not.toBeNull();
    const taxonomy = await page.waitForSelector(
      '[data-testid="filterby-taxonomy"]'
    );
    expect(taxonomy).not.toBeNull();
    const protein_size = await page.waitForSelector(
      '[data-testid="filterby-protein_size"]'
    );
    expect(protein_size).not.toBeNull();
    const table_selector = await page.waitForSelector(
      '[data-testid="view-table-button"]'
    );
    expect(table_selector).not.toBeNull();
    const grid_selector = await page.waitForSelector(
      '[data-testid="view-grid-button"]'
    );
    expect(grid_selector).not.toBeNull();
    //the default view is tabular
    const data_table = await page.waitForSelector('[data-testid="data-table"]');
    expect(data_table).not.toBeNull();
  });

  test('click-browse-page-protein-databases-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt`;
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
      const selection = await page.waitForSelector(
        '[data-testid="filters-panel"]'
      );
      expect(selection).not.toBeNull();
      const uniprot_curation = await page.waitForSelector(
        '[data-testid="filterby-uniprot_curation"]'
      );
      expect(uniprot_curation).not.toBeNull();
      const taxonomy = await page.waitForSelector(
        '[data-testid="filterby-taxonomy"]'
      );
      expect(taxonomy).not.toBeNull();
      const protein_size = await page.waitForSelector(
        '[data-testid="filterby-protein_size"]'
      );
      expect(protein_size).not.toBeNull();
      const table_selector = await page.waitForSelector(
        '[data-testid="view-table-button"]'
      );
      expect(table_selector).not.toBeNull();
      const grid_selector = await page.waitForSelector(
        '[data-testid="view-grid-button"]'
      );
      expect(grid_selector).not.toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
      expect(data_table).not.toBeNull();
    }
  });

  test('click-browse-page-structure-tab', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    //click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-structure"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/structure/));
  });

  test('click-browse-page-structure-all-structures-filter', async () => {
    //initial navigation to protein browse page
    const browseURL = `${homepage_url}structure/PDB/entry/InterPro`;
    const all_structures = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_structures}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/structure\/PDB`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-page-structure-database-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}structure/PDB`;
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
        `interpro\/structure\/PDB\/entry\/${db}`,
        'i'
      );
      expect(url).toEqual(expect.stringMatching(urlMatch));
    }
  });

  test('click-browse-page-structure-all-structures-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}structure/PDB/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const all_structures = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_structures}"]`),
    ]);
    const selection = await page.waitForSelector(
      '[data-testid="filters-panel"]'
    );
    expect(selection).not.toBeNull();
    const experiment_type = await page.waitForSelector(
      '[data-testid="filterby-experiment_type"]'
    );
    expect(experiment_type).not.toBeNull();
    const resolution = await page.waitForSelector(
      '[data-testid="filterby-resolution_(å)"]'
    );
    expect(resolution).not.toBeNull();
    const table_selector = await page.waitForSelector(
      '[data-testid="view-table-button"]'
    );
    expect(table_selector).not.toBeNull();
    const grid_selector = await page.waitForSelector(
      '[data-testid="view-grid-button"]'
    );
    expect(grid_selector).not.toBeNull();
    //the default view is tabular
    const data_table = await page.waitForSelector('[data-testid="data-table"]');
    expect(data_table).not.toBeNull();
  });

  test('click-browse-page-structure-database-filter-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}structure/PDB`;
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
      const selection = await page.waitForSelector(
        '[data-testid="filters-panel"]'
      );
      expect(selection).not.toBeNull();
      const experiment_type = await page.waitForSelector(
        '[data-testid="filterby-experiment_type"]'
      );
      expect(experiment_type).not.toBeNull();
      const resolution = await page.waitForSelector(
        '[data-testid="filterby-resolution_(å)"]'
      );
      expect(resolution).not.toBeNull();
      const table_selector = await page.waitForSelector(
        '[data-testid="view-table-button"]'
      );
      expect(table_selector).not.toBeNull();
      const grid_selector = await page.waitForSelector(
        '[data-testid="view-grid-button"]'
      );
      expect(grid_selector).not.toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
      expect(data_table).not.toBeNull();
    }
  });

  test('click-browse-page-taxonomy-tab', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    //click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-taxonomy"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/taxonomy/));
  });

  test('click-browse-page-proteome-tab', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    //click entry tab
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="browse-tab-proteome"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/proteome/));
  });

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
});
