# /scripts

This directory contains the scripts run by npm when the appropriate argument is supplied to `npm run`

1. `eslint.js`
2. `lighthouse,js`
3. `report-build-info.js`
4. `serve.js` Starts the server
5. `test-init.js` Starts the functional tests

### Browse with puppeteer

Here we go again. I know we have done this before and dropped it because of the instability of it. But here is another attempt to get through all the filter combinations in the browse area in order to trigger all API requests and be able to have a list of essential URLs to use for the cache warmer, that is not based on the previous version of the cache. This is useful in case the filters change and there are new essential URLs.

#### Usage

Have an API running locally in debug mode.This among other things logs all the requests in a file located in ` ../requests.log` if you are i.n the directory of your API.I would recommend having the cache running and active because this script requires patience, and needs to be re-run multiple times. So running the cache will save you some time.

The top of the file has some constants that you might want to play with, and once you happy with that just run:

```
node scripts/browse-with-puppetteer.js
```

My suggestion is to run by parts. The script accepts arguments specifying the endpoint to browse by. For instance just the Browse - By InterPro:

```
node scripts/browse-with-puppetteer.js --interpro
```

And if it fails restart it multiple times until it finishes, it doesn't matter if a page is loaded again generating duplicates of the API request. At the end we can clean the API log file.

The protein endpoint is the one with more filters, so more combinations to go through. Maybe in that one, you might want to split the run more, maybe just running a couple of DBs at the time. The easiest will be to comment out some DBs from the array at the top of the file.

Once you complete it, and have a mandatory celebratory drink, you can run:

```
sort ../requests.log | uniq > your_file_of_esential_api_url.log
```

and then use it in the cache warming!

##### Known Issues

- Because of the way the sticky header of the website is implemented. there are ocassions where puppeteer scrolls into a component but endup under the header, and mistakingly clicks on the interpro logo, sending the page to Home. I have added some Scroll to top to cater for that, but if you notice happening, you could, press the back button in the browser and scroll the page to make the filter visible. If done quickly enough, this can just let the script resume where it was.

- When the table has very few items and the filter bar is longer than the table, the footer of elixir might endup over the last filter and instead of clicking an option it ends up opening the elixir page. The script should keep going as the page is open in a different tab, but that particular filter combination was never clicked.
