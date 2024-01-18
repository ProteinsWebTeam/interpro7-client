// @flow
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import {
  webComponents as supportsWebComponents,
  inert as supportsInert,
  intersectionObserver as supprtsIntersectionObserver,
} from 'utils/support';

const responses /*: Map<string, Promise<boolean>> */ = new Map();

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
    async () =>
      await import(/* webpackChunkName: "webcomponents-polyfill" */'@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce'),
    'webComponents',
    supportsWebComponents,
  ) || Promise.resolve(true);
};

export const intersectionObserver = () /*: Promise<boolean> */ => {
  return (
    loadPolyfillIfNeeded(
      async () => {
        await import(
          /* webpackChunkName: "intersection-observer" */ 'intersection-observer'
        );
      },
      'intersectionObserver',
      supprtsIntersectionObserver,
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

export const elementMatches = () => {
  // $FlowFixMe method-unbinding
  if (!Element.prototype.matches) {
    // $FlowIgnore
    Element.prototype.matches = Element.prototype.msMatchesSelector;
  }
};
