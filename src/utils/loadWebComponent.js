let polyfillLoader = async () => {
  const polyfills = await import(
    /* webpackChunkName: "utils-polyfills" */'utils/polyfills'
  );
  const WCPolyfill = await polyfills.webComponents();
  polyfillLoader = () => WCPolyfill;
  return WCPolyfill;
};

export default importer => ({
  async as(namespace) {
    let _ns = namespace;
    // Check if not already defined
    if (_ns && window.customElements.get(_ns)) return;
    await polyfillLoader();
    let webComponent = await importer();
    if (webComponent.default) webComponent = webComponent.default;
    // if no name was specified, use default provided by WebComponent
    if (!_ns && webComponent.is) _ns = webComponent.is;
    // if at this point there is no name, give up
    if (!_ns) {
      throw new Error('Please specify a name for WebComponent');
    }
    // Check again, to avoid race conditions
    if (window.customElements.get(_ns)) return;
    window.customElements.define(_ns, webComponent);
    return _ns;
  },
});
