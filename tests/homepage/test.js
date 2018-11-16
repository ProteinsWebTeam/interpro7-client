import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';

const ONE_MINUTE = 60000; // needed when run in EBI cluster

jest.setTimeout(ONE_MINUTE / 2);

const checkForElement = async (page, selector) => {
  let status = '';
  try {
    const selection = await page.waitForSelector(selector, { timeout: 100 });
  } catch (e) {
    status = e.toString();
  }
  return status;
};

describe('tests', () => {
  const testSetup = testInit();
  let page;

  beforeAll(async () => {
    page = await testSetup.setup('SVGA');
  });

  afterAll(testSetup.cleanup);

  test('home-title', async () => {
    const title = await page.title();
    expect(title).toBe('InterPro');
  });

  test('home-intro-content', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="intro-content"]'
    );
    expect(selection).not.toBeNull();
  });

  test('home-intro-fig', async () => {
    const selection = await page.waitForSelector('[data-testid="intro-fig"]');
    expect(selection).not.toBeNull();
  });

  test('home-by-member-database-box', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="by-member-database-box"]'
    );
    expect(selection).not.toBeNull();
  });

  test('home-by-entry-type-box', async () => {
    //entry type is not displayed by default
    let status = await checkForElement(
      page,
      '[data-testid="by-entry-type-box"]'
    );
    expect(status).toMatch('TimeoutError');
  });

  test('home-click-by-entry-type-box', async () => {
    // entry type is not displayed by default
    // and it needs a focus event to scroll it into view
    await page.focus('[data-testid="home-entry-type-button"]');
    await page.click('[data-testid="home-entry-type-button"]');
    const selection = await page.waitForSelector(
      '[data-testid="by-entry-type-box"]'
    );
    expect(selection).not.toBeNull();
  });

  test('home-by-species-box', async () => {
    //species box is not displayed by default
    let status = await checkForElement(page, '[data-testid="by-species-box"]');
    expect(status).toMatch('TimeoutError');
  });

  test('home-click-by-species-box', async () => {
    // species box is not displayed by default
    // and it needs a focus event to scroll it into view
    await page.focus('[data-testid="home-species-button"]');
    await page.click('[data-testid="home-species-button"]');
    const selection = await page.waitForSelector(
      '[data-testid="by-species-box"]'
    );
    expect(selection).not.toBeNull();
  });

  test('home-by-latest-entries-box', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="by-latest-entries-box"'
    );
    expect(selection).not.toBeNull();
  });

  test('home-blog-entries-box', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="blog-entries-box"'
    );
    expect(selection).not.toBeNull();
  });

  test('home-click-by-member-database-icon', async () => {
    // and it needs a focus event to scroll it into view
    await page.click('[data-testid="home-member-database-button"]');
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="member-database-pfam"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringContaining('/entry/pfam'));
  });

  test('search', async () => {
    await page.type('input[type="text"]', '1');
    await sleep(1500); // eslint-disable-line no-magic-numbers
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringContaining('/search/text/1/'));
  });
});
