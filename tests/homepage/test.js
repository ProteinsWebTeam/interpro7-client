import testInit from '../../scripts/test-init';
import config from '../test_config';
import { checkForElement } from '../utils';

jest.setTimeout(config.two_minutes);

const gotoURL = async (page, url) => {
  await Promise.all([
    page.waitForNavigation(),
    page.goto(url, { waitUntil: 'networkidle0' }),
  ]);
};

describe('tests', () => {
  const testSetup = testInit('HD1080Portait');
  let page;
  let homepageURL;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepageURL = await page.evaluate(() => window.location.href);
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
    // entry type is not displayed by default
    const status = await checkForElement(
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
    // species box is not displayed by default
    const status = await checkForElement(
      page,
      '[data-testid="by-species-box"]'
    );
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
    for (const memberDatabase of config.general.entryType) {
      await gotoURL(page, homepageURL);
      await Promise.all([
        page.waitForNavigation(),
        page.click(`[data-testid="member-database-${memberDatabase}"]`),
      ]);
      const url = await page.evaluate(() => window.location.href);
      expect(url).toEqual(expect.stringContaining(`/entry/${memberDatabase}`));
    }
  });

  test('home-click-by-entry-type-icon', async () => {
    for (const entryType of config.general.entryTypes) {
      await gotoURL(page, homepageURL);
      await page.focus('[data-testid="home-entry-type-button"]');
      await page.click('[data-testid="home-entry-type-button"]');
      await Promise.all([
        page.waitForNavigation(),
        page.click(`[data-testid="entry-${entryType}"]`),
      ]);
      const url = await page.evaluate(() => window.location.href);
      expect(url).toEqual(
        expect.stringContaining(`/entry/InterPro/?type=${entryType}`)
      );
    }
  });

  test('home-click-by-species-icon', async () => {
    for (const taxid of config.homepage.species) {
      await gotoURL(page, homepageURL);
      await page.focus('[data-testid="home-species-button"]');
      await page.click('[data-testid="home-species-button"]');
      await Promise.all([
        page.waitForNavigation(),
        page.click(`[data-testid="species-${taxid}"]`),
      ]);
      const url = await page.evaluate(() => window.location.href);
      expect(url).toEqual(
        expect.stringContaining(`/taxonomy/uniprot/${taxid}/`)
      );
    }
  });

  test('search', async () => {
    /*
    await page.type('input[type="text"]', '1');
    await sleep(1500); // eslint-disable-line no-magic-numbers
     */
    await gotoURL(page, homepageURL);
    await Promise.all([
      page.waitForNavigation(),
      page.type('input[type="text"]', '1'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringContaining('/search/text/1/'));
  });
});
