import testInit from '../../scripts/test-init';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('QHD');
  let page;
  let homepageURL;

  const expectedElements = [
    '[data-testid="entry-titlebar"]',
    '[data-testid="entry-titlebar"] [data-testid="entry-type-icon"]',
    '[data-testid="entry-titlebar"] [data-testid="entry-accession"]',
    '[data-testid="entry-titlebar"] [data-testid="entry-title"]',
    '[data-testid="entry-member-db-icon"]',
  ];

  const notExpectedElements = [
    '[data-testid="entry-titlebar"] [data-testid="entry-member-db-icon"]',
  ];

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

  test('click-browse-entry-row', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro/#table`;
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
      expect.stringMatching(/interpro\/entry\/interpro\/IPR/i)
    );
  });

  test('click-browse-entry-grid-item', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro/#grid`;
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
      expect.stringMatching(/interpro\/entry\/interpro\/IPR/i)
    );
  });

  test('click-browse-entry-page-elements', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro/#table`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // click first entry row
    await Promise.all([
      page.waitForSelector('[data-testid="table-entity"] a', {
        timeout: 0,
      }),
      page.click('[data-testid="table-entity"] a'),
    ]);
    await pageElementTests(expectedElements, notExpectedElements);
  });
});
