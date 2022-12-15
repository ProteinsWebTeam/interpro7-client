#!/usr/bin/env node

// external modules required: node-fetch, timing-functions
const fetch = require('node-fetch');
const sleep = require('timing-functions').sleep;
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);

const PATH = path.resolve(args.length ? args[0] : './dist/sitemap');
const API_URL = 'https://wwwdev.ebi.ac.uk:443/interpro/api/';
const BASE_URL = `${API_URL}/entry/{DB}/?page_size=200`;
const DATABASES = ['interpro', 'pfam'];

const ONE_SEC = 1000;
const TEN_SEC = 10000;
const ONE_MIN = 60000;

const status = {
  ok: 200,
  empty: 204,
  timeout: 408,
};
const processItem = function* ({
  metadata: { accession, source_database: db },
}) {
  yield `https://www.ebi.ac.uk/interpro/entry/${db}/${accession}\n`;
};

const getVersion = async function () {
  const response = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
    method: 'HEAD',
  });

  if (response.status !== status.ok) {
    return null;
  }
  return response.headers.get('InterPro-Version');
};
const main = async function* (startURL) {
  let next = startURL;
  while (next) {
    try {
      const response = await fetch(next, {
        headers: { Accept: 'application/json' },
      });
      // If the server sent a timeout response…
      if (response.status === status.timeout) {
        // …wait a bit for the server to process the query in the background…
        await sleep(ONE_MIN);
        // …then continue this loop with the same URL
        continue;
      } else if (response.status === status.empty) {
        break;
      }
      const payload = await response.json();
      for (const item of payload.results) {
        yield* processItem(item);
      }
      next = payload.next;
      // Don't overload the server, give it a bit of time before asking for more
      if (next) await sleep(ONE_SEC);
    } catch (Exception) {
      process.stdout.write('there was a fetch error, tryin again in 10 SEC');
      await sleep(TEN_SEC);
    }
  }
};
const isThereASiteMapFor = function (version) {
  return fs.existsSync(PATH) && fs.existsSync(`${PATH}/${version}`);
};
const generateFolder = function (version) {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
  }
  if (!fs.existsSync(`${PATH}/${version}`)) {
    fs.mkdirSync(`${PATH}/${version}`);
  }
  return `${PATH}/${version}`;
};

const generateEntriesSiteMap = async function (writeStream, url) {
  let processed = 0;
  const interval = setInterval(() => {
    readline.clearLine(process.stdout); // clear current text
    readline.cursorTo(process.stdout, 0); // move cursor to beginning of line
    process.stdout.write(`URLs written: ${processed}`);
  }, ONE_SEC);

  for await (const output of main(url)) {
    writeStream.write(output);
    processed++;
  }
  return interval;
};
const createOrReplaceSymLink = function (target, path) {
  const createLink = () =>
    fs.symlink(target, path, () =>
      process.stdout.write(`🔗 Link created: ${path}\n`)
    );
  if (fs.existsSync(path)) {
    fs.unlink(path, () => {
      process.stdout.write(`❌ Previous Link deleted: ${path}\n`);
      createLink();
    });
  } else {
    createLink();
  }
};

if (require.main === module) {
  // If used from the command line, will write data to stdout asap
  const mainWriteToStdout = async () => {
    const process = require('process');
    // If pipe is interrupted, it might be normal, just exit
    process.stdout.on('error', ({ code }) =>
      process.exit(code === 'EPIPE' ? 0 : 1)
    );
    const version = await getVersion();
    if (isThereASiteMapFor(version)) {
      process.stdout.write(
        `⚠️ There is already a sitemap for version ${version}\n`
      );
      return;
    }
    const newPath = generateFolder(version);
    process.stdout.write(`📁 Folders created ${newPath}\n`);
    const entryFileName = 'entries.interpro.sitemap.txt';
    const newSitemap = `${newPath}/${entryFileName}`;
    const writeStream = fs.createWriteStream(`${newPath}/${entryFileName}`);
    for (const db of DATABASES) {
      process.stdout.write(`🗃️ Processing: ${db}\n`);
      const interval = await generateEntriesSiteMap(
        writeStream,
        BASE_URL.replace('{DB}', db)
      );
      clearInterval(interval);
    }
    writeStream.end();
    createOrReplaceSymLink(newSitemap, `${PATH}/${entryFileName}`);
    process.stdout.write(`🌎 Map created: ${newSitemap}\n`);
  };
  mainWriteToStdout();
} else {
  // If used as a module, can be used as an async generator
  module.exports = (baseURL = BASE_URL) => main(baseURL);
}
