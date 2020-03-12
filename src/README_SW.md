Service Worker Caching the App files
===

The InterPro 7 client uses a service worker to handle the caching of the App files (`.js`, `.css`, etc.).

The service worker is generated using the webpack plugin [offline-plugin](https://github.com/NekR/offline-plugin), and its configuration can be found in [webpack.config.js](../webpack.config.js#L362).

The current setup basically tells the service worker to cache `.js` and `.css` files immediatly. Only when those are cached, then cache web workers, and optionally cache fonts and images. 

The service worker code gets generated when webpack is deploying the code. Two files are generated:  `dist/sw.module.js` and `dist/sw.legacy.js`. The first one is use for modern browser that support modules and other recent features, while the other will cover some legacy browsers.

The logic to install the service worker is in [offline.js](./offline.js), which is included in [App.js](./App.js) to be able to pass the redux store. Once installed, there is an infinite loop that checks every 30 minutes if there is an update.

The service-worker was configured to emit events, and we have setup listeners as part of the installation. It's in one of these listeners that we included the logic to dispatch an action to display a tooltip(Toast) when there is a new version of the App.


