import puppeteer from 'puppeteer';

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
  FourK: {
    width: 3840,
    height: 2160,
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
    width: 1440,
  },
  FourKPortrait: {
    height: 3840,
    width: 2160,
  },
};

export const memberDatabases = [
  'cathgene3d',
  'cdd',
  'hamap',
  'panther',
  'pfam',
  'pirsf',
  'prints',
  'profile',
  'prosite',
  'sfld',
  'smart',
  'ssf',
  'tigrfams',
];

export const puppeteerConfig = {
  headless: true,
  slowMo: 250,
  args: [
    '--disable-dev-shm-usage',
    // TODO: next two lines should eventually be removed, since they are not
    // TODO: recommended for security reasons
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
};

export default (
  resolutionCode /*: string */ = 'HD1080',
  server /*: string */ = 'dev'
) =>
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

        browser = await puppeteer.launch(puppeteerConfig);
        const page = await browser.newPage();
        page.setViewport({
          width: resolution.width,
          height: resolution.height,
          deviceSaleFactor: 4,
        });
        await page.goto(location.href);
        return page;
      },
      async cleanup() {
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
