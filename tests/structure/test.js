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
    '[data-testid="structure-accession"]',
    '[data-testid="structure-experiment-type"]',
    '[data-testid="structure-resolution"]',
    '[data-testid="structure-chains"]',
    '[data-testid="structure-released"]',
    '[data-testid="structure-external-links"]',
    '[data-testid="structure-3d-viewer"]',
    '[data-testid="structure-protvista"]',
    '[data-testid="structure-entry-select"]',
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

  test('click-browse-structure-row', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/pdb/#table`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click first entry row
    await Promise.all([
      page.waitForSelector('[data-testid="table-entity"] a', {
        timeout: 0,
      }),
      page.click('[data-testid="table-entity"] a'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(/interpro\/structure\/pdb\/[^\s]{4}/i)
    );
  });

  test('click-browse-structure-grid-item', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/pdb/#grid`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click first entry row
    await Promise.all([
      page.waitForSelector('[data-testid="grid-entity"] a', {
        timeout: 0,
      }),
      page.click('[data-testid="grid-entity"] a'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(/interpro\/structure\/pdb\/[^\s]{4}/i)
    );
  });

  test('click-browse-structure-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}structure/pdb/101m`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    await pageElementTests(expectedElements, notExpectedElements);
  });
});
