// @flow
import { parse } from 'url';

const hashRegExp = /^#?(.*)$/;

export const getHashPartWithoutHashSign = (string /*:: ?: ?string */) =>
  ((string || '').match(hashRegExp) || [])[1] || '';

export default (
  activeClass /*: ?(string | function) */,
  customLocation /*: Object */,
  predefinedHref /*:: ?: string */,
  generatedHref /*: string */,
  exact /*:: ?: boolean*/,
) => {
  // If an href was given, assume it can't be active (because outside of scope)
  if (predefinedHref) return;
  // If we have a function, just depend on the result of that function
  if (typeof activeClass === 'function') return activeClass(customLocation);
  let pathname;
  let hash;
  try {
    pathname = window.location.pathname;
    hash = getHashPartWithoutHashSign(location.hash);
  } catch (_) {
    /**/
  }
  // Not running in browser, so, for now, ignore active class
  // TODO: if we start doing server-side rendering we need to re-enable this
  if (!pathname) return;
  const { pathname: generatedPathname, hash: generatedHash } = parse(
    generatedHref,
  );
  const generatedCleanHash = getHashPartWithoutHashSign(generatedHash);
  if (hash && generatedCleanHash && hash !== generatedCleanHash) return;
  if (exact) {
    // If we want an exact match
    // We check strict equality
    if (pathname === generatedPathname) return activeClass;
  } else {
    if (pathname.startsWith(generatedPathname)) return activeClass;
  }
};
