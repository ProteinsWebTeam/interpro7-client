// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { _RelatedAdvanced as Related } from 'components/Related';

/*:: type Props = {
  data: Object,
}*/

class EntrySubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    const mainData = this.props.data.payload[0];
    const secondaryData = [];
    return (
      <Related
        mainData={mainData}
        secondaryData={secondaryData}
        isStale={false}
        mainType="protein"
        focusType="entry"
        focusDB="InterPro"
        actualSize={mainData.matches.length}
      />
    );
  }
}

export default EntrySubPage;
