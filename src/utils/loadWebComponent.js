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
    if (window.customElements.get(namespace)) return;
    await polyfillLoader();
    const webComponent = await importer();
    window.customElements.define(namespace, webComponent);
  },
});
