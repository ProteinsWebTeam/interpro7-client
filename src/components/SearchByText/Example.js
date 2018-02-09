import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

class Example extends PureComponent {
  static propTypes = {
    children: T.string,
  };

  render() {
    const child = this.props.children;
    return (
      <i>
        {' '}
        <Link
          to={{
            description: {
              main: { key: 'search' },
              search: { type: 'text', value: child },
            },
          }}
        >
          {child}
        </Link>
      </i>
    );
  }
}

export default Example;
