// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Lazy from 'wrappers/Lazy';

class LazyImage extends PureComponent /*:: <{ alt: string }> */ {
  static propTypes = {
    alt: T.string,
  };

  render() {
    const { alt, ...props } = this.props;
    return (
      <Lazy>
        {hasBeenVisible =>
          hasBeenVisible ? <img alt={alt} {...props} /> : null
        }
      </Lazy>
    );
  }
}

export default LazyImage;
