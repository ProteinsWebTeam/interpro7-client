/* Currently not in use. The performance improvement wasn't significant in early test,
 * but worth to investigate more.
 *
 * To run the package critcal would need to be installed
 */

const path = require('path');
const critical = require('critical');

critical.generate({
  /* The path of the Webpack bundle */
  base: path.resolve('.'),
  src: 'interpro/index.html',
  target: 'interpro/index.html',
  inline: true,
  extract: true,

  /* iPhone 6 dimensions, use whatever you like*/
  width: 375,
  height: 565,

  /* Ensure that bundled JS file is called */
  penthouse: {
    blockJSRequests: false,
  },
});
