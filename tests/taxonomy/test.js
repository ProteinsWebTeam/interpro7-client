import testInit from '../../scripts/test-init';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('QHD');
  let page;
  let homepageURL;

  const expectedElements = [
    '[data-testid="titlebar"]',
    '[data-testid="titlebar"] [data-testid="accession"]',
    '[data-testid="titlebar"] [data-testid="title"]',
    '[data-testid="menu"]',
    '[data-testid="menu"] [data-testid="menu-overview"]',
    '[data-testid="menu"] [data-testid="menu-entries"]',
    '[data-testid="menu"] [data-testid="menu-proteins"]',
    '[data-testid="taxonomy-taxid"]',
    '[data-testid="taxonomy-rank"]',
    '[data-testid="taxonomy-lineage"]',
    '[data-testid="taxonomy-children"]',
  ];

  const notExpectedElements = [];

  beforeAll(async () => {
    page = await testSetup.setup();
    homepageURL = await page.evaluate(() => window.location.href);
  });

  afterAll(testSetup.cleanup);

  const pageElementTests = async (expectedElements, notExpectedElements) => {
    for (const selector of expectedElements) {
      const selection = await page.waitForSelector(selector);
      expect(selection).not.toBeNull();
    }
    for (const selector of notExpectedElements) {
      const selection = await checkForElement(page, selector);
      expect(selection).toMatch('TimeoutError');
    }
  };

  test('click-browse-taxonomy-row', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}taxonomy/uniprot/#table`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click first entry row
    await Promise.all([
      page.waitForSelector('[data-testid="table-entity"] a', {
        timeout: 0,
      }),
      page.click('[data-testid="table-entity"] a'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(
      `${window.location.href}/taxonomy/uniprot/\\d+/`,
      'i'
    );
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  test('click-browse-taxonomy-grid-item', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}taxonomy/uniprot/#grid`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click first entry row
    await Promise.all([
      page.waitForSelector('[data-testid="grid-entity"] a', {
        timeout: 0,
      }),
      page.click('[data-testid="grid-entity"] a'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    const urlMatch = new RegExp(
      `${window.location.href}/taxonomy/uniprot/\\d+/`,
      'i'
    );
    expect(url).toEqual(expect.stringMatching(urlMatch));
  });

  // TODO test('click-browse-taxonomy-tree-item', async () => {});

  test('click-browse-taxonomy-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}taxonomy/uniprot/100`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    await pageElementTests(expectedElements, notExpectedElements);
  });
});
