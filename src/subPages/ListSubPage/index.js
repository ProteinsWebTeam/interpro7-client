// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Related from 'components/Related';

class ListSubPage extends PureComponent /*:: <{data: Object}> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    return <Related data={this.props.data} />;
  }
}

export default ListSubPage;
