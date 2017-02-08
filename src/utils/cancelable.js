// @flow
export default (promise/*: Promise<any> */) => {
  let canceled = false;
  return {
    promise: new Promise((res/*: function */, rej/*: function */) => (
      promise.then(
        val => canceled ? rej({canceled}) : res(val),
        err => canceled ? rej({canceled}) : rej(err)
      )
    )),
    cancel() {
      canceled = true;
    },
  };
};
