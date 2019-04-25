import testInit from '../../scripts/test-init';
import config from '../test_config';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('HD1080Portait');
  let page;
  let homepageURL;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepageURL = await page.evaluate(() => window.location.href);
  });

  afterAll(testSetup.cleanup);

  test('browse-page-tabs', async () => {
    // initial navigation to browse page
    const browseURL = `${homepageURL}entry/interpro`;
    await Promise.all([page.waitForNavigation(), page.goto(browseURL)]);

    // check presence of browse type buttons
    for (const type of config.browse.browseTypes) {
      const selection = await page.waitForSelector(
        `[data-testid="browse-tab-${type}"]`,
        { timeout: 3000 }
      );
      expect(selection).not.toBeNull();
    }
  });
});
