// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
// $FlowFixMe
import Related from 'components/Related';

class EntrySubPage extends PureComponent /*:: <{data: Object}> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    return <Related data={this.props.data} />;
  }
}

export default EntrySubPage;
