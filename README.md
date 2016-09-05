[![Build Status](https://travis-ci.org/ProteinsWebTeam/interpro7-client.svg?branch=master)](https://travis-ci.org/ProteinsWebTeam/interpro7-client)
[![Coverage Status](https://coveralls.io/repos/github/ProteinsWebTeam/interpro7-client/badge.svg?branch=master)](https://coveralls.io/github/ProteinsWebTeam/interpro7-client?branch=master)

New InterPro Web-Client
============

Requirements
------------

-   Node version 6+
    (if not in your system, or lower version,
    see [nvm](https://github.com/creationix/nvm),
    or install from [node.js](https://nodejs.org/en/))

How to install
--------------

-   Clone from this repo

-   `npm i` (or `npm install`) to install all dependencies

-   Create configuration file `config.yml` at the root of the project
    (see `config.yml.example` for an example)

Development
-----------

-   `npm run start` to start the tests (that will re-run on file change)
    and to start the dev server

-   Access the website at the address defined in your configuration

Other
-----

You can check the list of possible commands by running `npm run`,
and run them as stand-alone commands
