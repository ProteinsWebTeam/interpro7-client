// @flow
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import {
  webComponents as supportsWebComponents,
  detailsTag as supportsDetailsTag,
  inert as supportsInert,
} from 'utils/support';

let responses /*: Map<string, Promise<boolean>> */ = new Map();

const loadPolyfillIfNeeded = (
  loader /*: function */,
  name /*: string */,
  support /*: boolean */,
) => {
  if (!responses.has(name)) {
    responses.set(
      name,
      new Promise(async (resolve, reject) => {
        if (support) {
          resolve(true);
          return;
        }
        try {
          await loader();
          resolve(false);
        } catch (error) {
          reject(error);
        }
      }),
    );
  }
  return responses.get(name);
};

// Tries to get Web Components support somehow (through polyfill if need be)
// Throws if failed to have Web Component support, even when trying to polyfill
// Return a boolean, true if native support, false if polyfilled
// prettier-ignore
export const webComponents = ()/*: Promise<boolean> */ => {
  return loadPolyfillIfNeeded(
    () =>
      import(/* webpackChunkName: "webcomponents-polyfill" */'@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce'),
    'webComponents',
    supportsWebComponents,
  ) || Promise.resolve(true);
};

export const detailsTag = () /*: Promise<boolean> */ => {
  return (
    loadPolyfillIfNeeded(
      () =>
        import(/* webpackChunkName: "detailstags-polyfill" */ 'details-element-polyfill'),
      'detailsTag',
      supportsDetailsTag,
    ) || Promise.resolve(true)
  );
};

export const inert = () /*: Promise<boolean> */ => {
  return (
    loadPolyfillIfNeeded(
      () => import(/* webpackChunkName: "inert-polyfill" */ 'wicg-inert'),
      'inert',
      supportsInert,
    ) || Promise.resolve(true)
  );
};
