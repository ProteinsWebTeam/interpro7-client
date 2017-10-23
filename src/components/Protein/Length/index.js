import React, { PureComponent } from 'react';
import T from 'prop-types';

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
        Length: {length} amino acids{fragmentText}
      </div>
    );
  }
}

export default Length;
