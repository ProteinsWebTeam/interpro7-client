// @flow
import React, { PureComponent } from 'react';

import UserId from 'components/UserId';

export default class Privacy extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <h4>Privacy</h4>
        <p>lorem ipsum</p>
        <h5>UUID</h5>
        <p>
          A unique identifier is associated to this session for analytics
          purposes. It is not linked to any personal data, it is generated on
          this browser and there is no way for us to link it back to an
          individual. You can reset it at any time.
        </p>
        <UserId />
      </section>
    );
  }
}
