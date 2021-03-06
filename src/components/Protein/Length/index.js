// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
/*:: type Props = {
  metadata: {
    length: number,
    fragment?: string
  }
}; */
class Length extends PureComponent /*:: <Props> */ {
  static propTypes = {
    metadata: T.shape({
      length: T.number.isRequired,
      fragment: T.string,
    }).isRequired,
  };

  render() {
    const {
      metadata: { length, fragment },
    } = this.props;
    let fragmentText;
    if (fragment) {
      fragmentText = ` (${fragment === 'N' ? 'complete' : 'fragment'})`;
    }
    return (
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
        {length} amino acids
        {fragmentText}
      </Link>
    );
  }
}

export default Length;
