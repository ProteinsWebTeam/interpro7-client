import React, { PureComponent } from 'react';
import T from 'prop-types';
import filesize from 'filesize';

import { NumberComponent } from 'components/NumberLabel';

const NO_CONTENT = 204;

const getText = ({ loading, payload, ok, status, headers }) => {
  if (loading) return 'Getting estimation from server…';

  if (!ok) return 'An error happened during the request to the server.';

  if (status === NO_CONTENT) {
    return 'No data was found for this specific query.';
  }

  if (!payload) return 'An unexpected error happened.';

  const count = payload.count;
  if (count) {
    return (
      <React.Fragment>
        Your file will contain <NumberComponent value={count} abbr /> item
        {count > 1 ? 's' : ''}.
      </React.Fragment>
    );
  }

  let size = +headers.get('content-length');
  if (!size) {
    size = JSON.stringify(payload, null, 2).length;
  }
  if (size && Number.isFinite(size)) {
    const [value, suffix] = filesize(size, {
      round: 0,
      standard: 'iec',
      output: 'array',
    });
    return (
      <React.Fragment>
        Your file size will be of <NumberComponent value={value} /> {suffix}
      </React.Fragment>
    );
  }

  return 'No estimate available.';
};

export default class Estimate extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.oneOfType([T.arrayOf(T.object), T.object]),
      ok: T.bool,
      status: T.number,
      headers: T.instanceOf(Headers),
    }).isRequired,
  };

  render() {
    return (
      <section>
        <h6>Estimation</h6>
        {getText(this.props.data)}
      </section>
    );
  }
}
