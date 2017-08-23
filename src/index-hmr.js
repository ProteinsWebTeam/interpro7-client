/* eslint-env node */
import React from 'react';
import { render } from 'react-dom';

export default DOM_ROOT => {
  // This block enables HMR if posible
  if (module.hot && typeof module.hot.accept === 'function') {
    // If any change in App or its dependency tree
    module.hot.accept('App', () => {
      // Reloads App
      const NextApp = require('App').default;
      // Re-renders App
      render(<NextApp />, DOM_ROOT);
    });
  }
};
