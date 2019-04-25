import testInit from '../../scripts/test-init';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('QHD');
  let page;
  let homepageURL;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepageURL = await page.evaluate(() => window.location.href);
  });

  afterAll(testSetup.cleanup);

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
});
