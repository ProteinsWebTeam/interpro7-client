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
});
