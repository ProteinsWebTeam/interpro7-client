// @flow
export default (promise/*: Promise<any> */) => {
  let canceled = false;
  return {
    promise: promise.then(value => {
      if (canceled) throw {canceled};// eslint-disable-line no-throw-literal
      return value;
    }),
    cancel() {
      canceled = true;
    },
  };
};
