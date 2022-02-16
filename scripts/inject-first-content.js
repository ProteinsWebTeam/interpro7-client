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
  const destinationGZ = createWriteStream(input + '.gz');
  await pipe(source, gzip, destinationGZ);
  console.log('GZIP:', input + '.gz');
  const destinationBR = createWriteStream(input + '.br');
  await pipe(sourceBr, brotli, destinationBR);
  console.log('BROTLY:', input + '.br');
}

const URL = process.env.URL || 'http://localhost:8888/interpro/loading/';

puppeteer
  .launch()
  .then(async (browser) => {
    const page = await browser.newPage();
    let innerHTML;
    try {
      await Promise.all([page.waitForNavigation(), page.goto(URL)]);
      await page.waitForSelector('#interpro-root', {
        timeout: 3000,
      });
      innerHTML = await page.$eval('#root', (element) => {
        return element.innerHTML;
      });

      // console.log(html);
    } catch (e) {
      console.error("Couldn't load content of the page", e);
    }
    await browser.close();
    if (innerHTML?.length) {
      let indexHTML = fs.readFileSync(
        path.resolve('.', 'dist', 'hydrate.html'),
        {
          encoding: 'utf8',
        }
      );
      indexHTML = indexHTML.replace(
        '<div id="root"><div class="loading"><div></div>',
        `<div id="root">${innerHTML}</div>`
      );
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
        indexHTML,
        (err) => {
          if (err) throw err;
          console.log(`New index.html created`);
        }
      );
      compress(path.resolve('.', 'dist', 'index.html')).catch((err) => {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      });
    }
  })
  .finally(() => {
    server.close();
  });
