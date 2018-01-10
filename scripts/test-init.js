import puppeteer from 'puppeteer';
// import { sleep } from 'timing-functions';

import server from './serve';

export const app = (port /*: number */) => `http://localhost:${port}/interpro/`;

const width = 1024;
const height = 800;

export const config = {
  // headless: false,
  // slowMo: 40,
  headless: true,
  args: [
    `--window-size=${width},${height}`,
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
        browser = await puppeteer.launch(config);
        const page = await browser.newPage();
        page.setViewport({ width, height });
        await page.goto(app(port));
        return page;
      },
      async cleanup() {
        // await sleep(1000);
        browser.close();
        server.close();
      },
    };
  })();
