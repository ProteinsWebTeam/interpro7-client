import testInit from '../scripts/test-init';
import { sleep } from 'timing-functions';

const ONE_MINUTE = 60000; // needed when run in EBI cluster

jest.setTimeout(ONE_MINUTE);

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
    await page.type('input[type="text"]', 'IPR000001', { delay: 1 });
    await sleep(1500); // eslint-disable-line no-magic-numbers
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringContaining('/search/text/IPR000001/'));
  });
});
