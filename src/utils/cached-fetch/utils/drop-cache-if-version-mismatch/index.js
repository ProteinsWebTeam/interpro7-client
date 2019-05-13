// @flow

// let interProVersion;

export const VersionHeader = 'InterPro-Version';
//
// export default (headers /*: Headers */) => {
//   const version = headers.get(VersionHeader);
//   if (version && interProVersion !== version) {
//     // The headers says we have a different version
//     const dropEverything = !!interProVersion;
//     interProVersion = version;
//     if (dropEverything) {
//       window.sessionStorage.clear();
//       return true;
//     } // else, it's the first time we run through this function
//   }
// };

export default (headers /*: Headers */) => {
  const versionFromResponse = headers.get(VersionHeader);
  const key = 'interpro7-current-data-version';
  const versionFromCache = sessionStorage.getItem(key);
  let dropEverything = false;
  if (!versionFromResponse) return; // the response doesn't include aversion, so don't drop the cache
  if (!versionFromCache) {
    // first time using the logic of saving the data version
    dropEverything = true;
  } else if (versionFromResponse !== versionFromCache) {
    // Mismatch of versions
    dropEverything = true;
  }
  if (dropEverything) {
    sessionStorage.setItem(key, versionFromResponse);
    window.sessionStorage.clear();
    return true;
  }
};
