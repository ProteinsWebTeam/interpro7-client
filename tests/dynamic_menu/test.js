import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';
import config from '../test_config';

jest.setTimeout(config.two_minutes);

const checkForElement = async (page, selector) => {
  let status = '';
  try {
    const selection = await page.waitForSelector(selector, {
      timeout: config.fast_timeout,
    });
  } catch (e) {
    status = e.toString();
  }
  return status;
};

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

  test('dynamic-menu-home', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-home"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-search', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-search"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-browse', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-browse"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-results', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-results"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-release_notes', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-release_notes"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-download', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-download"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-help', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-help"]'
    );
    expect(selection).not.toBeNull();
  });

  test('dynamic-menu-about', async () => {
    const selection = await page.waitForSelector(
      '[data-testid="menu-tab-about"]'
    );
    expect(selection).not.toBeNull();
  });

  test('click-dynamic-menu-home', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-home"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/$/));
  });

  test('click-dynamic-menu-search', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-search"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/search/));
  });

  test('click-dynamic-menu-browse', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-browse"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/entry/));
  });

  test('click-dynamic-menu-results', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-results"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/result/));
  });

  test('click-dynamic-menu-release_notes', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-release_notes"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/release_notes/));
  });

  test('click-dynamic-menu-download', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-download"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/download/));
  });

  test('click-dynamic-menu-help', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-help"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/help/));
  });

  test('click-dynamic-menu-about', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-about"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(expect.stringMatching(/interpro\/about/));
  });
});
