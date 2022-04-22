/**
 * It uses puppetter to open the webpage and the loading page; gets the innerHTML
 * of the root element and injects it in the static hydrate.html to create a new
 * index.html with precalcualted content (A la SSR), and should use React hydrate
 * to reuse it when JS takes over.
 *
 * The content generation worked OK, but React hydrate discarded it.
 *
 * If we manage to make the hydration part works, this could rally impact the
 * web vital LCP score of the home page.
 *
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { createGzip, createBrotliCompress } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');

const server = require('./server');
const pipe = promisify(pipeline);
const { createReadStream, createWriteStream } = require('fs');

async function compress(input) {
  const gzip = createGzip();
  const brotli = createBrotliCompress();
  const source = createReadStream(input);
  const sourceBr = createReadStream(input);
  const destinationGZ = createWriteStream(`${input}.gz`);
  await pipe(source, gzip, destinationGZ);
  console.log('GZIP:', `${input}.gz`);
  const destinationBR = createWriteStream(`${input}.br`);
  await pipe(sourceBr, brotli, destinationBR);
  console.log('BROTLY:', `${input}.br`);
}

// const URL = process.env.URL || 'http://localhost:8888/interpro/loading/';
const URL = process.env.URL || 'http://localhost:8888/interpro/';
const URL_LOADING =
  process.env.URL || 'http://localhost:8888/interpro/loading/';

puppeteer
  .launch()
  .then(async (browser) => {
    const page = await browser.newPage();
    let innerHTML;
    let innerLoadingHTML;
    try {
      // Getting the innerHTML of the home page
      await Promise.all([page.waitForNavigation(), page.goto(URL)]);
      await page.waitForSelector('#interpro-root', {
        timeout: 3000,
      });
      innerHTML = await page.$eval('#root', (element) => {
        return element.innerHTML;
      });

      // Getting the innerHTML of the loading page
      await Promise.all([page.waitForNavigation(), page.goto(URL_LOADING)]);
      await page.waitForSelector('#interpro-root', {
        timeout: 3000,
      });
      innerLoadingHTML = await page.$eval('#root', (element) => {
        return element.innerHTML;
      });
    } catch (e) {
      console.error("Couldn't load content of the page", e);
    }
    await browser.close();

    const indexHTML = fs.readFileSync(
      path.resolve('.', 'dist', 'hydrate.html'),
      {
        encoding: 'utf8',
      }
    );
    if (innerHTML?.length) {
      const newIndexHTML = indexHTML.replace(
        '<div id="root"><div class="loading"><div></div>',
        `<div id="root">${innerHTML}</div>`
      );
      // Moving the Original files index=>render
      ['', '.gz', '.br'].forEach((ext) => {
        const source = `index.html${ext}`;
        const target = `render.html${ext}`;
        fs.rename(
          path.resolve('.', 'dist', source),
          path.resolve('.', 'dist', target),
          (err) => {
            if (err) throw err;
            console.log(`[${source}] => [${target}]`);
          }
        );
      });

      fs.writeFile(
        path.resolve('.', 'dist', 'index.html'),
        newIndexHTML,
        (err) => {
          if (err) throw err;
          console.log('New index.html created');
        }
      );
      compress(path.resolve('.', 'dist', 'index.html')).catch((err) => {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      });
    }

    if (innerLoadingHTML?.length) {
      const newIndexLoadingHTML = indexHTML.replace(
        '<div id="root"><div class="loading"><div></div>',
        `<div id="root">${innerLoadingHTML}</div>`
      );

      fs.writeFile(
        path.resolve('.', 'dist', 'index.loading.html'),
        newIndexLoadingHTML,
        (err) => {
          if (err) throw err;
          console.log('New index.loading.html created');
        }
      );
      compress(path.resolve('.', 'dist', 'index.loading.html')).catch((err) => {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      });
    }
  })
  .finally(() => {
    server.close();
  });
