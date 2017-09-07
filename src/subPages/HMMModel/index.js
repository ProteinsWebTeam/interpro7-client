// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import HmmModelSection from 'components/Entry/HmmModels';

class HMMModelSubPage extends PureComponent /*:: <{ data: Object }> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    if (this.props.data.loading) return <div>Loading…</div>;
    return <HmmModelSection logo={this.props.data.payload} />;
  }
}

export default HMMModelSubPage;
