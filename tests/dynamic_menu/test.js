import testInit from '../../scripts/test-init';
import { sleep } from 'timing-functions';

const TWO_MINUTES = 120000; // needed when run in EBI cluster

jest.setTimeout(TWO_MINUTES);

const checkForElement = async (page, selector) => {
  let status = '';
  try {
    const selection = await page.waitForSelector(selector, { timeout: 100 });
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
  let homepage_url;

  beforeAll(async () => {
    page = await testSetup.setup();
    homepage_url = await page.evaluate(() => window.location.href);
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
  // test('home-intro-fig', async () => {
  //   const selection = await page.waitForSelector('[data-testid="intro-fig"]');
  //   expect(selection).not.toBeNull();
  // });
  //
  // test('home-by-member-database-box', async () => {
  //   const selection = await page.waitForSelector(
  //     '[data-testid="by-member-database-box"]'
  //   );
  //   expect(selection).not.toBeNull();
  // });
  //
  // test('home-by-entry-type-box', async () => {
  //   //entry type is not displayed by default
  //   let status = await checkForElement(
  //     page,
  //     '[data-testid="by-entry-type-box"]'
  //   );
  //   expect(status).toMatch('TimeoutError');
  // });
  //
  // test('home-click-by-entry-type-box', async () => {
  //   // entry type is not displayed by default
  //   // and it needs a focus event to scroll it into view
  //   await page.focus('[data-testid="home-entry-type-button"]');
  //   await page.click('[data-testid="home-entry-type-button"]');
  //   const selection = await page.waitForSelector(
  //     '[data-testid="by-entry-type-box"]'
  //   );
  //   expect(selection).not.toBeNull();
  // });
  //
  // test('home-by-species-box', async () => {
  //   //species box is not displayed by default
  //   let status = await checkForElement(page, '[data-testid="by-species-box"]');
  //   expect(status).toMatch('TimeoutError');
  // });
  //
  // test('home-click-by-species-box', async () => {
  //   // species box is not displayed by default
  //   // and it needs a focus event to scroll it into view
  //   await page.focus('[data-testid="home-species-button"]');
  //   await page.click('[data-testid="home-species-button"]');
  //   const selection = await page.waitForSelector(
  //     '[data-testid="by-species-box"]'
  //   );
  //   expect(selection).not.toBeNull();
  // });
  //
  // test('home-by-latest-entries-box', async () => {
  //   const selection = await page.waitForSelector(
  //     '[data-testid="by-latest-entries-box"'
  //   );
  //   expect(selection).not.toBeNull();
  // });
  //
  // test('home-blog-entries-box', async () => {
  //   const selection = await page.waitForSelector(
  //     '[data-testid="blog-entries-box"'
  //   );
  //   expect(selection).not.toBeNull();
  // });
  //
  // test('home-click-by-member-database-icon', async () => {
  //   for (const member_database of MEMBER_DATABASES) {
  //     await gotoURL(page, homepage_url);
  //     await Promise.all([
  //       page.waitForNavigation(),
  //       page.click(`[data-testid="member-database-${member_database}"]`),
  //     ]);
  //     const url = await page.evaluate(() => window.location.href);
  //     expect(url).toEqual(expect.stringContaining(`/entry/${member_database}`));
  //   }
  // });
  //
  // test('home-click-by-entry-type-icon', async () => {
  //   for (const entry_type of ENTRY_TYPES) {
  //     await gotoURL(page, homepage_url);
  //     await page.focus('[data-testid="home-entry-type-button"]');
  //     await page.click('[data-testid="home-entry-type-button"]');
  //     await Promise.all([
  //       page.waitForNavigation(),
  //       page.click(`[data-testid="entry-${entry_type}"]`),
  //     ]);
  //     const url = await page.evaluate(() => window.location.href);
  //     expect(url).toEqual(
  //       expect.stringContaining(`/entry/InterPro/?type=${entry_type}`)
  //     );
  //   }
  // });
  //
  // test('home-click-by-species-icon', async () => {
  //   for (const taxid of TAXIDS) {
  //     await gotoURL(page, homepage_url);
  //     await page.focus('[data-testid="home-species-button"]');
  //     await page.click('[data-testid="home-species-button"]');
  //     await Promise.all([
  //       page.waitForNavigation(),
  //       page.click(`[data-testid="species-${taxid}"]`),
  //     ]);
  //     const url = await page.evaluate(() => window.location.href);
  //     expect(url).toEqual(
  //       expect.stringContaining(`/taxonomy/uniprot/${taxid}/`)
  //     );
  //   }
  // });
  //
  // test('search', async () => {
  //   /*
  //   await page.type('input[type="text"]', '1');
  //   await sleep(1500); // eslint-disable-line no-magic-numbers
  //    */
  //   await gotoURL(page, homepage_url);
  //   await Promise.all([
  //     page.waitForNavigation(),
  //     page.type('input[type="text"]', '1'),
  //   ]);
  //   const url = await page.evaluate(() => window.location.href);
  //   expect(url).toEqual(expect.stringContaining('/search/text/1/'));
  // });
});
