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
    console.log('Browse general: Expected tabs passed');
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
    console.log('Browse General: Entry tab passed');
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
    console.log('Browse Entry: InterPro DB filter passed');
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
    console.log('Browse Entry: Member DB filters passed');
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
    console.log('Browse Entry: InterPro DB page elements passed');
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
    console.log('Browse Entry: Member DB page elements passed');
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
    console.log('Browse General: Protein tab passed');
  });

  test('click-browse-page-protein-all-proteins-filter', async () => {
    //initial navigation to protein browse page
    const browseURL = `${homepage_url}protein/UniProt/entry/InterPro`;
    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/protein\/UniProt`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
    console.log('Browse Protein: All proteins DB filter passed');
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
    console.log('Browse Protein: InterPro/Member DB filter passed');
  });

  test('click-browse-page-protein-all-proteins-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}protein/UniProt/entry/InterPro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);
    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.click(`[data-testid="memberdb-filter-${all_itemss}"]`, {
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
    const tree_selector = await page.waitForSelector(
      '[data-testid="view-tree-button"]'
    );
    expect(tree_selector).toBeNull();
    //the default view is tabular
    const data_table = await page.waitForSelector('[data-testid="data-table"]');
    expect(data_table).not.toBeNull();
    console.log('Browse Protein: All proteins DB page elements passed');
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
      const tree_selector = await page.waitForSelector(
        '[data-testid="view-tree-button"]'
      );
      expect(tree_selector).toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
      expect(data_table).not.toBeNull();
    }
    console.log(
      'Browse Protein: All proteins InterPro/Member DB page elements passed'
    );
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
    console.log('Browse General: Structure tab passed');
  });

  test('click-browse-page-structure-all-structures-filter', async () => {
    //initial navigation to structure browse page
    const browseURL = `${homepage_url}structure/PDB/entry/InterPro`;
    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/structure\/PDB`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
    console.log('Browse Structure: All structure DB filter passed');
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
    console.log('Browse Structure: InterPro/Member DB filter passed');
  });

  test('click-browse-page-structure-all-database-filter-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}structure/PDB`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    const databases = config.general.member_databases;
    databases.push(config.general.interpro);
    databases.push(all_items); //the same filters are used for all db filter selections
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
      const tree_selector = await page.waitForSelector(
        '[data-testid="view-tree-button"]'
      );
      expect(tree_selector).toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
      expect(data_table).not.toBeNull();
    }
    console.log('Browse Structure: All/InterPro/Member DB page elements');
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
    console.log('Browse General: Taxonomy tab passed');
    d;
  });

  test('click-browse-page-taxonomy-all-taxonomy-filter', async () => {
    //initial navigation to taxonomy browse page
    const browseURL = `${homepage_url}taxonomy/uniprot/entry/InterPro`;
    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/taxonomy\/uniprot`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
    console.log('Browse Taxonomy: All taxonomy DB filter passed');
  });

  test('click-browse-page-taxonomy-database-filters', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}taxonomy/uniprot`;
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
    console.log('Browse Taxonomy: All member DB filter passed');
  });

  test('click-browse-page-taxonomy-all-database-filter-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}taxonomy/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    const databases = config.general.member_databases;
    databases.push(config.general.interpro);
    databases.push(all_items); //the same filters are used for all db filter selections
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
      expect(selection).toBeNull();
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
      expect(tree_selector).not.toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
      expect(data_table).not.toBeNull();
    }
    console.log(
      'Browse Taxonomy: All/InterPro/Member DB taxonomy page elements passed'
    );
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
    console.log('Browse General: Proteome tab passed');
  });

  test('click-browse-page-proteome-all-proteome-filter', async () => {
    //initial navigation to proteome browse page
    const browseURL = `${homepage_url}proteome/uniprot/entry/InterPro`;
    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    await Promise.all([
      page.waitForNavigation(),
      page.click(`[data-testid="memberdb-filter-${all_items}"]`),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(`interpro\/proteome\/uniprot`, 'i');
    expect(url).toEqual(expect.stringMatching(urlMatch));
    console.log('Browse proteome: All proteome DB filter passed');
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
    console.log('Browse proteome: All member DB filter passed');
  });

  test('click-browse-page-proteome-all-database-filter-page-elements', async () => {
    //initial navigation to browse page
    const browseURL = `${homepage_url}proteome/uniprot`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    const all_items = 'all'; // 'all' is used as the memberdb name to represent 'all proteins'
    const databases = config.general.member_databases;
    databases.push(config.general.interpro);
    databases.push(all_items); //the same filters are used for all db filter selections
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
      expect(selection).toBeNull();
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
      expect(tree_selector).not.toBeNull();
      //the default view is tabular
      const data_table = await page.waitForSelector(
        '[data-testid="data-table"]'
      );
      expect(data_table).not.toBeNull();
    }
    console.log(
      'Browse Proteome: All/InterPro/Member DB proteome page elements passed'
    );
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
    console.log('Browse General: Set tab passed');
  });
});
