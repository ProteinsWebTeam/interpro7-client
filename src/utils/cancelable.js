// @flow

/*:: type Output = {
  promise: Promise<*>,
  cancel: () => void,
}; */

// prettier-ignore
export default (promise/*: Promise<*> */ = Promise.resolve())/*: Output */ => {
  let canceled = false;
  return {
    promise: promise.then(value => {
      if (canceled) throw { canceled }; // eslint-disable-line no-throw-literal
      return value;
    }),
    cancel() {
      canceled = true;
    },
  };
};
