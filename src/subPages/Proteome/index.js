// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Related from 'components/Related';

class ProteomeSubPage extends PureComponent /*:: <{data: Object, customLocation: Object}> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    return <Related data={this.props.data} />;
  }
}

export default ProteomeSubPage;
