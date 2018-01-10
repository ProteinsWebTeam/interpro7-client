import testInit from './test-init';
// TODO: fix this module's export for node
import { sleep } from 'timing-functions';

describe('tests', () => {
  const testSetup = testInit();
  let page;

  beforeAll(async () => {
    page = await testSetup.setup();
  });

  afterAll(testSetup.cleanup);

  test('title', async () => {
    const title = await page.title();
    expect(title).toBe('InterPro');
  });

  test('search', async () => {
    await page.type('input[type="text"', 'IPR000001');
    await sleep(1500); // eslint-disable-line no-magic-numbers
    // This is failing, check why. Because redirect is indeed working 🤔
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringContaining('/search/text/IPR000001'));
  });
});
