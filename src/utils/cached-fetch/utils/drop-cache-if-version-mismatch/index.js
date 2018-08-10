// @flow

let interProVersion;

export const VersionHeader = 'InterPro-Version';

export default (headers /*: Headers */) => {
  const version = headers.get(VersionHeader);
  if (version && interProVersion !== version) {
    // The headers says we have a different version
    const dropEverything = !!interProVersion;
    interProVersion = version;
    if (dropEverything) {
      window.sessionStorage.clear();
      return true;
    } // else, it's the first time we run through this function
  }
};
