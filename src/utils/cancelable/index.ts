type CancelableParameter<T> =
  | Promise<unknown>
  | ((signal: AbortSignal) => Promise<T>);

export default <T = unknown>(
  promiseOrFunction: CancelableParameter<T> = Promise.resolve()
) => {
  let promise = promiseOrFunction;
  const controller = new AbortController();
  if (!('then' in promiseOrFunction)) {
    // not actually a Promise
    promise = promiseOrFunction(controller.signal);
  }
  const output = {
    promise: (promise as Promise<T>).then((value) => {
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
