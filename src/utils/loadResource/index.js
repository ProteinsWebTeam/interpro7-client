// @flow
const map = new Map();

export default (url/*: string */, type/*: string */ = 'text/javascript') => {
  let promise = map.get(url);
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.type = type;
    element.async = true;
    element.onerror = reject;
    element.onload = resolve;
    element.src = url;
    if (!(document && document.head)) {
      reject();
      return;
    }
    document.head.appendChild(element);
  });
  map.set(url, promise);
  return promise;
};
