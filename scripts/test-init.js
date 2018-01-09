import puppeteer from 'puppeteer';
import tf from 'timing-functions';

export const APP = 'http://0.0.0.0:8888/interpro/';

const width = 1024;
const height = 800;

export const config = {
  headless: false,
  slowMo: 40,
  args: [`--window-size=${width},${height}`],
};

export default () =>
  (() => {
    let browser;
    return {
      async setup() {
        browser = await puppeteer.launch(config);
        const page = await browser.newPage();
        page.setViewport({ width, height });
        await page.goto(APP);
        return page;
      },
      async cleanup() {
        await tf['timing-functions'].sleep(1000);
        browser.close();
      },
    };
  })();
