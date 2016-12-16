/* globals require: false */
import {webComponents as supportsWebComponents} from 'utils/support';

export const webComponents = () => new Promise(res => {
  if (supportsWebComponents) {
    res(true);
    return;
  }
  require.ensure([], () => {
    // TODO: fix error in firefox
    // require('skatejs-web-components/src');
    res(false);
  }, 'web-components-polyfill');
});
