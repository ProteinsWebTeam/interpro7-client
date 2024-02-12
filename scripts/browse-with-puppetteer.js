/**
 * The idea of this script is to automatically go through all the filters
 * in the browse area of the website. This in combination with a local API
 * in debug mode, will capture all the API requests needed to be cached.
 *
 * The file can then be used in the cahche warming procedures instead of
 * one generated from the previous release.
 */

const puppeteer = require('puppeteer'); // v20.7.4 or later

const DELAY_ON_EACH_PAGE = 1000;
const NUMBER_OF_RETRIES = 3;
const TIMEOUT = 30000;

const SHOULD_RUN = {
  interpro: false,
  dbs: false,
  protein: true,
  structure: false,
  taxonomy: false,
  proteome: false,
  set: false,
};

const DBS = [
  'all',
  'interpro',
  'antifam',
  'cathgene3d',
  'cdd',
  'hamap',
  'ncbifam',
  'panther',
  'pfam',
  'pirsf',
  'prints',
  'profile',
  'prosite',
  'sfld',
  'smart',
  'ssf',
];
const MEMBER_DBS = DBS.filter((db) => !['all', 'interpro'].includes(db));

const DBS_WITH_SETS = ['all', 'cdd', 'pfam', 'pirsf'];

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);

  const locatorRaceClickWithRetries = async (locators, timeout = TIMEOUT) => {
    for (let i = 0; i < NUMBER_OF_RETRIES; i++) {
      try {
        return await puppeteer.Locator.race(locators)
          .setTimeout(timeout)
          .click();
      } catch (e) {
        console.log(`Attempt Failed - ${i + 1}/${NUMBER_OF_RETRIES}`);
      }
    }
  };

  const clickCookieBanner = async () => {
    const targetPage = page;
    console.log('cookie banner');
    await delay(6000);
    await locatorRaceClickWithRetries([
      targetPage.locator('::-p-text(I agree, dismiss this banner)'),
    ]);
  };
  const clickBrowse = async () => {
    const targetPage = page;
    console.log('Menu browse click');
    await locatorRaceClickWithRetries([
      targetPage.locator('::-p-aria(▾ Browse)'),
      targetPage.locator("[data-testid='menu-tab-browse'] > div > a"),
      targetPage.locator(
        '::-p-xpath(//*[@data-testid=\\"menu-tab-browse\\"]/div/a)'
      ),
      targetPage.locator(
        ":scope >>> [data-testid='menu-tab-browse'] > div > a"
      ),
      targetPage.locator('::-p-text(▾ Browse)'),
    ]);
  };
  const clickBrowseOption = async (option) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(`::-p-aria(${option}[role=\\"link\\"])`),
      targetPage.locator(`::-p-text(${option})`),
    ]);
  };

  const clickTableView = async (view) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(`::-p-aria(view your results in a ${view})`),
      targetPage.locator(`[data-testid='view-${view}-button']`),
      targetPage.locator(
        `::-p-xpath(//*[@data-testid=\\"view-${view}-button\\"])`
      ),
      targetPage.locator(`:scope >>> [data-testid='view-${view}-button']`),
    ]);
  };
  const clickMemberDB = async (db) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(`[data-testid='memberdb-filter-${db}']`),
      targetPage.locator(
        `::-p-xpath(//*[@data-testid=\\"memberdb-filter-${db}\\"])`
      ),
      targetPage.locator(`:scope >>> [data-testid='memberdb-filter-${db}']`),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };
  const scrollToTop = async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  };

  {
    const targetPage = page;
    await targetPage.setViewport({
      width: 1141,
      height: 803,
    });
  }
  {
    const targetPage = page;
    const promises = [];
    const startWaitingForEvents = () => {
      promises.push(targetPage.waitForNavigation());
    };
    startWaitingForEvents();
    await targetPage.goto('http://localhost:8080/interpro/');
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    await targetPage.keyboard.up('Meta');
  }
  await clickCookieBanner();
  /**
   * Browse By InterPro
   * */

  const interProTypes = [
    'family',
    'domain',
    'homologous superfamily',
    'repeat',
    'conserved site',
    'active site',
    'binding site',
    'ptm',
  ];
  const clickInterProType = async (entryType) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(`interpro-type[type="${entryType}"] >>>> text`),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };

  const goOptions = ['All', 'F', 'P', 'C'];
  const clickGoOption = async (goOption) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=go_category][value=${goOption}]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };

  const interproTableViews = ['table', 'grid'];

  if (SHOULD_RUN.interpro) {
    console.log('Browse By InterPro');

    for (const view of interproTableViews) {
      await clickBrowse();
      await clickBrowseOption('By InterPro');
      await clickTableView(view);
      console.log(` > View: ${view}`);

      for (const entryType of interProTypes) {
        console.log(` > > Entry type: ${entryType}`);
        await clickInterProType(entryType);
        for (const go of goOptions) {
          console.log(` > > > GO optiom: ${go}`);
          await clickGoOption(go);
        }
      }
    }
  }

  /**
   * Browse By Member DB
   * */
  const memberDBTableViews = ['table', 'grid'];

  const interproState = ['both', 'integrated', 'unintegrated'];
  const clickInterproState = async (state) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=interpro_state][value=${state}]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };

  if (SHOULD_RUN.dbs) {
    console.log('\n\nBrowse By Member DB');
    for (const view of memberDBTableViews) {
      await clickBrowse();
      await clickBrowseOption('By Member DB');
      await clickTableView(view);
      console.log(` > View: ${view}`);
      for (const db of MEMBER_DBS) {
        await clickMemberDB(db);
        console.log(` > > Member DB: ${db}`);
        for (const state of interproState) {
          console.log(` > > > InterPro State: ${state}`);
          await clickInterproState(state);
          // Entry type list is variable so needs to bre treated differently
          await delay(DELAY_ON_EACH_PAGE * 2);
          await scrollToTop();
          const entryTypesInputs = await page.$$(
            'div[data-testid="filterby-member_database_entry_type"] label input'
          );
          for (const input of entryTypesInputs) {
            const value = await page.evaluate(
              (el) => el.getAttribute('value'),
              input
            );
            console.log(` > > > > Entry type: ${value}`);
            input.click();
            await delay(DELAY_ON_EACH_PAGE);
          }
        }
      }
    }
  }

  /**
   * Browse By Protein
   * */
  const matchPresence = ['both', 'true', 'false'];
  const clickMatchPresence = async (value) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=match_presence_filter][value=${value}]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };
  const curationStatus = ['uniprot', 'reviewed', 'unreviewed'];
  const clickCurationStatus = async (status) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=curated_filter][value=${status}]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };

  const sequenceStatus = ['both', 'false', 'true'];
  const clickSequenceStatus = async (status) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=fragment_filter][value=${status}]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };

  if (SHOULD_RUN.protein) {
    console.log('\n\nBrowse By Protein');
    const proteinTableViews = ['table', 'grid'];

    for (const view of proteinTableViews) {
      await clickBrowse();
      await clickBrowseOption('By Protein');
      await clickTableView(view);
      console.log(` > View: ${view}`);
      await delay(DELAY_ON_EACH_PAGE);
      for (const db of DBS) {
        console.log(` > > Member DB: ${db}`);
        await clickMemberDB(db);

        for (const presence of db === 'all' ? matchPresence : [false]) {
          if (presence) {
            console.log(` > >> Match Presence: ${presence}`);
            await clickMatchPresence(presence);
          }
          for (const status of curationStatus) {
            console.log(` > > > Curation Status: ${status}`);
            await clickCurationStatus(status);
            for (const seqStatus of sequenceStatus) {
              console.log(` > > > > Sequence Status: ${seqStatus}`);
              await clickSequenceStatus(seqStatus);
              // Organisms list is variable so needs to bre treated differently
              await delay(DELAY_ON_EACH_PAGE * 3);
              await scrollToTop();
              const orgInputs = await page.$$('.list-taxonomy label input');
              for (const orgInput of orgInputs) {
                const value = await page.evaluate(
                  (el) => el.getAttribute('value'),
                  orgInput
                );
                console.log(` > > > > > Organism: ${value}`);
                orgInput.click();
                await delay(DELAY_ON_EACH_PAGE);
              }
              // Reset to all
              orgInputs?.[0]?.click();
              await delay(DELAY_ON_EACH_PAGE);
            }
            // Reset to both
            await clickSequenceStatus('both');
            await scrollToTop();
            await delay(DELAY_ON_EACH_PAGE);
          }
          // Reset to Uniprot
          await clickCurationStatus('uniprot');
          await scrollToTop();
          await delay(DELAY_ON_EACH_PAGE);
        }
      }
    }
  }

  /**
   * Browse By Structure
   * */
  const experimentTypes = ['All', 'x-ray', 'em', 'nmr'];
  const clickExperimentType = async (value) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=experiment_type][value=${value}]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };
  const resolutions = ['-1', '0', '1', '2'];
  const clickResolution = async (value) => {
    const targetPage = page;
    await locatorRaceClickWithRetries([
      targetPage.locator(
        `input[type=radio][name=resolution][value="${value}"]`
      ),
    ]);
    await delay(DELAY_ON_EACH_PAGE);
  };

  if (SHOULD_RUN.structure) {
    console.log('\n\nBrowse By Structure');
    const proteinTableViews = ['table', 'grid'];

    for (const view of proteinTableViews) {
      await clickBrowse();
      await clickBrowseOption('By Structure');
      await clickTableView(view);
      console.log(` > View: ${view}`);
      await delay(DELAY_ON_EACH_PAGE);
      for (const db of DBS
        // Filters in antifam are disabled
        .filter((db) => db !== 'antifam')) {
        console.log(` > > Member DB: ${db}`);
        await clickMemberDB(db);

        for (const expType of experimentTypes) {
          console.log(` > > > Exp Type: ${expType}`);
          await clickExperimentType(expType);
          if (expType !== 'nmr') {
            for (const res of resolutions) {
              console.log(` > > > > Resolution: ${res}`);
              await clickResolution(res);
            }
            await clickResolution('-1');
          }
        }
        await clickExperimentType('All');
      }
    }
  }

  /**
   * Browse By Taxonomy
   * */

  if (SHOULD_RUN.taxonomy) {
    console.log('\n\nBrowse By Taxonomy');
    const taxTableViews = ['table', 'grid', 'tree'];

    for (const view of taxTableViews) {
      await clickBrowse();
      await clickBrowseOption('By Taxonomy');
      await clickTableView(view);
      console.log(` > View: ${view}`);
      await delay(DELAY_ON_EACH_PAGE);
      for (const db of DBS) {
        console.log(` > > Member DB: ${db}`);
        await clickMemberDB(db);
        await delay(DELAY_ON_EACH_PAGE);
      }
    }
  }

  /**
   * Browse By Proteome
   * */

  if (SHOULD_RUN.proteome) {
    console.log('\n\nBrowse By Proteome');
    const proteomeTableViews = ['table', 'grid'];

    for (const view of proteomeTableViews) {
      await clickBrowse();
      await clickBrowseOption('By Proteome');
      await clickTableView(view);
      console.log(` > View: ${view}`);
      await delay(DELAY_ON_EACH_PAGE * 2);
    }
  }

  /**
   * Browse By Sets
   * */

  if (SHOULD_RUN.set) {
    console.log('\n\nBrowse By Sets');
    const proteomeTableViews = ['table', 'grid'];

    for (const view of proteomeTableViews) {
      await clickBrowse();
      await clickBrowseOption('By Clan/Set');
      await clickTableView(view);
      console.log(` > View: ${view}`);
      await delay(DELAY_ON_EACH_PAGE);
      for (const db of DBS_WITH_SETS) {
        console.log(` > > Member DB: ${db}`);
        await clickMemberDB(db);
        await delay(DELAY_ON_EACH_PAGE);
      }
    }
  }

  // wait a bit before closing to give time to any pending URL requests
  await delay(DELAY_ON_EACH_PAGE * 10);

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
