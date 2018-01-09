// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

class Length extends PureComponent {
  static propTypes = {
    metadata: T.shape({
      length: T.number.isRequired,
      fragment: T.string,
    }).isRequired,
  };

  render() {
    const { metadata: { length, fragment } } = this.props;
    let fragmentText;
    if (fragment) {
      fragmentText = ` (${fragment === 'N' ? 'complete' : 'fragment'})`;
    }
    return (
      <div>
        {'Length: '}
        <Link
          to={({ description }) => ({
            description: {
              ...description,
              [description.main.key]: {
                ...description[description.main.key],
                detail: 'sequence',
              },
            },
          })}
        >
          {length} amino acids{fragmentText}
        </Link>
      </div>
    );
  }
}

export default Length;
