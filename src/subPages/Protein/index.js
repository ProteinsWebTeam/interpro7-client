// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Related from 'components/Related';

class ProteinSubPage extends PureComponent /*:: <{data: Object}> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    return (
      <div>
        <Related data={this.props.data} />
      </div>
    );
  }
}

export default ProteinSubPage;
