// @flow
import puppeteer from 'puppeteer';

import server from './serve';

export const app = (port /*: number */) => `http://localhost:${port}/interpro/`;

const width = 1024;
const height = 800;

export const config = {
  headless: true,
  // headless: false,
  // slowMo: 250,
  args: [
    `--window-size=${width},${height}`,
    '--disable-dev-shm-usage',
    // TODO: next two lines should eventually be removed, since they are not
    // TODO: recommended for security reasons
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
};

export default () =>
  (() => {
    let browser;
    return {
      async setup() {
        const port = await server.start();
        if (!port) throw new Error("Server didn't start correctly");
        browser = await puppeteer.launch(config);
        const page = await browser.newPage();
        page.setViewport({ width, height });
        await page.goto(app(port));
        return page;
      },
      async cleanup() {
        // await sleep(1000);
        try {
          if (browser) browser.close();
        } catch (_) {
          /**/
        }
        try {
          server.close();
        } catch (_) {
          /**/
        }
      },
    };
  })();
