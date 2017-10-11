// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import HmmModelSection from 'components/Entry/HmmModels';

import { foundationPartial } from 'styles/foundation';

const f = foundationPartial();

class HMMModelSubPage extends PureComponent /*:: <{ data: Object }> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    if (this.props.data.loading)
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading… </div>
        </div>
      );
    return <HmmModelSection logo={this.props.data.payload} />;
  }
}

export default HMMModelSubPage;
