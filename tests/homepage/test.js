import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';
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
  let homepage_url;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepage_url = await page.evaluate(() => window.location.href);
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
    for (const member_database of config.general.member_databases) {
      await gotoURL(page, homepage_url);
      await Promise.all([
        page.waitForNavigation(),
        page.click(`[data-testid="member-database-${member_database}"]`),
      ]);
      const url = await page.evaluate(() => window.location.href);
      expect(url).toEqual(expect.stringContaining(`/entry/${member_database}`));
    }
  });

  test('home-click-by-entry-type-icon', async () => {
    for (const entry_type of config.general.entry_types) {
      await gotoURL(page, homepage_url);
      await page.focus('[data-testid="home-entry-type-button"]');
      await page.click('[data-testid="home-entry-type-button"]');
      await Promise.all([
        page.waitForNavigation(),
        page.click(`[data-testid="entry-${entry_type}"]`),
      ]);
      const url = await page.evaluate(() => window.location.href);
      expect(url).toEqual(
        expect.stringContaining(`/entry/InterPro/?type=${entry_type}`)
      );
    }
  });

  test('home-click-by-species-icon', async () => {
    for (const taxid of config.homepage.species) {
      await gotoURL(page, homepage_url);
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
    await gotoURL(page, homepage_url);
    await Promise.all([
      page.waitForNavigation(),
      page.type('input[type="text"]', '1'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringContaining('/search/text/1/'));
  });
});
