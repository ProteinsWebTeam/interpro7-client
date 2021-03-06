// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

export default class ApiLink extends PureComponent /*:: < {url: string} > */ {
  static propTypes = {
    url: T.string.isRequired,
  };

  render() {
    const { url } = this.props;
    return (
      <section>
        <h6>Corresponding API call</h6>
        <p>
          <Link href={url} target="_blank">
            <code>{url}</code>
          </Link>
        </p>
      </section>
    );
  }
}
