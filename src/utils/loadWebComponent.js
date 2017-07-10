// @flow
let polyfillLoader = async () => {
  const polyfills = await import(/* webpackChunkName: "utils-polyfills" */ 'utils/polyfills');
  const WCPolyfill = await polyfills.webComponents();
  polyfillLoader = () => WCPolyfill;
  return WCPolyfill;
};

export default (importer /*: Function */) => ({
  async as(namespace /*: ?string */) {
    let _ns = namespace;
    // Check if not already defined
    await polyfillLoader();
    if (_ns && window.customElements.get(_ns)) return;
    let webComponent = await importer();
    if (webComponent.default) webComponent = webComponent.default;
    // if no name was specified, use default provided by WebComponent
    if (!_ns && webComponent.is) _ns = webComponent.is;
    // if at this point there is no name, give up
    if (!_ns) {
      console.error('No name for WebComponent', webComponent);
      throw new Error('Please specify a name for WebComponent');
    }
    // Check again, to avoid race conditions
    if (window.customElements.get(_ns)) return;
    // Actually doing the defining
    window.customElements.define(_ns, webComponent);
    // Returning the name used for the definition, just in case might be useful
    return _ns;
  },
});
