import React, { PureComponent } from 'react';
import T from 'prop-types';

import { OldLink } from 'components/generic/Link';

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
      fragmentText = ` (${fragment === 'N' ? 'complete' : 'fragemnt'})`;
    }
    return (
      <div>
        {'Length: '}
        <OldLink
          newTo={({ description }) => ({
            description: { ...description, mainDetail: 'sequence' },
          })}
        >
          {length} amino acids{fragmentText}
        </OldLink>
      </div>
    );
  }
}

export default Length;
