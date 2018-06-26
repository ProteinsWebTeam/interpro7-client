import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

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
          className={f('neutral')}
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
