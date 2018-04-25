import AbortController from './AbortController';

/*:: type Output = {
  promise: Promise<*>,
  cancel: () => void,
}; */

// prettier-ignore
export default (
  promiseOrFunction/*: Promise<*> | () => Promise<*> */ = Promise.resolve()
)/*: Output */ => {
  let promise = promiseOrFunction;
  const controller = new AbortController();
  if (!('then' in promiseOrFunction)) {// not actually a Promise
    promise = promiseOrFunction(controller.signal);
  }
  const output = {
    promise: promise.then(value => {
      // eslint-disable-next-line no-throw-literal
      if (output.canceled) throw { canceled: output.canceled };
      return value;
    }),
    canceled: false,
    cancel() {
      output.canceled = true;
      controller.abort();
    },
  };
  return output;
};
