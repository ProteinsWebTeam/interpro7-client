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
    await polyfillLoader();
    if (window.customElements.get(namespace)) return;
    const webComponent = await importer();
    window.customElements.define(namespace, webComponent);
  },
});
