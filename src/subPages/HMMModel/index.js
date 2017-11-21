// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import HmmModelSection from 'components/Entry/HmmModels';
import { Loading } from 'components/SimpleCommonComponents';

import { foundationPartial } from 'styles/foundation';

const f = foundationPartial();

class HMMModelSubPage extends PureComponent /*:: <{ data: Object }> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    if (this.props.data.loading) return <Loading />;
    return <HmmModelSection logo={this.props.data.payload} />;
  }
}

export default HMMModelSubPage;
