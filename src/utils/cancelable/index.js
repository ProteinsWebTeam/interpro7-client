import AbortController from './AbortController';

/*:: type Output = {
  promise: Promise<*>,
  cancel: () => void,
}; */

// prettier-ignore
export default (
  promiseOrFunction/*: Promise<*> | () => Promise<*> */ = Promise.resolve()
)/*: Output */ => {
  let canceled = false;
  let promise = promiseOrFunction;
  const controller = new AbortController();
  if (!('then' in promiseOrFunction)) {// not actually a Promise
    promise = promiseOrFunction(controller.signal);
  }
  return {
    promise: promise.then(value => {
      if (canceled) throw { canceled }; // eslint-disable-line no-throw-literal
      return value;
    }),
    cancel() {
      canceled = true;
      controller.abort();
    },
  };
};
