#!/usr/bin/env node

// external modules required: node-fetch, timing-functions
const fetch = require('node-fetch');
const sleep = require('timing-functions').sleep;
const fs = require('fs');

const PATH = './dist/sitemap';
const API_URL = 'https://www.ebi.ac.uk:443/interpro/api/';
let BASE_URL = `${API_URL}/entry/InterPro/?page_size=200`;

const processItem = function* ({ metadata: { accession } }) {
  yield `https://www.ebi.ac.uk/interpro/entry/InterPro/${accession}\n`;
};

const getVersion = async function () {
  const response = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
    method: 'HEAD',
  });

  if (response.status !== 200) {
    return null;
  }
  return response.headers.get('InterPro-Version');
};
const main = async function* (startURL) {
  let next = startURL;
  while (next) {
    const response = await fetch(next, {
      headers: { Accept: 'application/json' },
    });
    // If the server sent a timeout response…
    if (response.status === 408) {
      // …wait a bit for the server to process the query in the background…
      await sleep(60000);
      // …then continue this loop with the same URL
      continue;
    } else if (response.status === 204) {
      break;
    }
    const payload = await response.json();
    for (const item of payload.results) {
      yield* processItem(item);
    }
    next = payload.next;
    // Don't overload the server, give it a bit of time before asking for more
    if (next) await sleep(1000);
  }
};
const isThereASiteMapFor = function (version) {
  return fs.existsSync(PATH) && fs.existsSync(PATH + '/' + version);
};
const generateFolder = function (version) {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
  }
  if (!fs.existsSync(PATH + '/' + version)) {
    fs.mkdirSync(PATH + '/' + version);
  }
  return PATH + '/' + version;
};

const generateInterProEntriesSiteMap = async function (path, url) {
  let writeStream = fs.createWriteStream(path);
  let processed = 0;
  const interval = setInterval(function () {
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
    process.stdout.write('URLs written: ' + processed);
  }, 1000);
  writeStream.on('finish', () => {
    clearInterval(interval);
  });
  for await (const output of main(url)) {
    writeStream.write(output);
    processed++;
  }
  writeStream.end();
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
        '⚠️ There is already a sitemap for version ' + version + '\n'
      );
      return;
    } else {
      const newPath = generateFolder(version);
      process.stdout.write('📁 Folders created ' + newPath + '\n');
      generateInterProEntriesSiteMap(
        newPath + '/entries.interpro.sitemap.txt',
        BASE_URL
      );
    }
  };
  mainWriteToStdout();
} else {
  // If used as a module, can be used as an async generator
  module.exports = (baseURL = BASE_URL) => main(baseURL);
}
