// @flow
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { webComponents as supportsWebComponents } from 'utils/support';

let response;

// Tries to get Web Components support somehow (through polyfill if need be)
// Throws if failed to have Web Component support, even when trying to polyfill
// Return a boolean, true if native support, false if polyfilled
// prettier-ignore
export const webComponents = ()/*: Promise<boolean> */ => {
  if (!response) {
    response = new Promise(async (res, rej) => {
      if (supportsWebComponents) {
        res(true);
        return;
      }
      try {
        await import(/* webpackChunkName: "webcomponents-polyfill" */
        '@webcomponents/webcomponentsjs/webcomponents-sd-ce');
        res(false);
      } catch (err) {
        rej(err);
      }
    });
  }
  return response;
};
