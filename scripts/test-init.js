// @flow
import puppeteer from 'puppeteer';
import { sleep } from 'timing-functions';
import server from './serve';
export const app = (port /*: number */) => `http://localhost:${port}/interpro/`;

export const RESOLUTION = {
  VGA: {
    width: 640,
    height: 480,
  },
  SVGA: {
    width: 800,
    height: 600,
  },
  XGA: {
    width: 1024,
    height: 768,
  },
  HD720: {
    width: 1280,
    height: 720,
  },
  HD1080: {
    width: 1920,
    height: 1080,
  },
  QHD: {
    width: 2560,
    height: 1440,
  },
  HD720Portait: {
    height: 1280,
    width: 720,
  },
  HD1080Portait: {
    height: 1920,
    width: 1080,
  },
  QHDPortait: {
    height: 2560,
    widths: 1440,
  },
};

export const config = {
  headless: true,
  //headless: false,
  slowMo: 250,
  args: [
    '--disable-dev-shm-usage',
    // TODO: next two lines should eventually be removed, since they are not
    // TODO: recommended for security reasons
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
};

export default (resolutionCode /*: string */ = 'HD1080') =>
  (() => {
    let browser;
    return {
      async setup() {
        if (!(resolutionCode in RESOLUTION)) {
          throw Error(
            `Resolution code '${resolutionCode}' not recognised as resolution`
          );
        }
        const resolution = RESOLUTION[resolutionCode];
        const port = await server.start();
        if (!port) throw new Error("Server didn't start correctly");
        config.args.push(
          `--window-size=${resolution.width},${resolution.height}`
        );
        browser = await puppeteer.launch(config);
        const page = await browser.newPage();
        page.setViewport({
          width: resolution.width,
          height: resolution.height,
        });
        await page.goto(app(port));
        return page;
      },
      async cleanup() {
        //await sleep(1000000);
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
