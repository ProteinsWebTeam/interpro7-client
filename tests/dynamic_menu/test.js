import testInit from '../../scripts/test-init';
import config from '../test_config';

jest.setTimeout(config.two_minutes);

describe('tests', () => {
  const testSetup = testInit('HD1080Portait');
  let page;

  beforeAll(async () => {
    page = await testSetup.setup();
    await page.evaluate(() => window.location.href);
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
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/`))
    );
  });

  test('click-dynamic-menu-search', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-search"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/search/`))
    );
  });

  test('click-dynamic-menu-browse', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-browse"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/entry/`))
    );
  });

  test('click-dynamic-menu-results', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-results"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/result/`))
    );
  });

  test('click-dynamic-menu-release_notes', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-release_notes"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(
        new RegExp(`${window.location.href}/release_notes/`)
      )
    );
  });

  test('click-dynamic-menu-download', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-download"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/download/`))
    );
  });

  test('click-dynamic-menu-help', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-help"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/help/`))
    );
  });

  test('click-dynamic-menu-about', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="menu-tab-about"]'),
    ]);
    const url = await page.evaluate(() => window.location.href);
    expect(url).toEqual(
      expect.stringMatching(new RegExp(`${window.location.href}/about/`))
    );
  });
});
