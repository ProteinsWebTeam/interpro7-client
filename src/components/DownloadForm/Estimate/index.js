import React, { PureComponent } from 'react';
import T from 'prop-types';
import filesize from 'filesize';

import NumberComponent from 'components/NumberComponent';

const NO_CONTENT = 204;

const getText = ({ loading, payload, ok, status, headers }, isStale) => {
  if (loading || isStale) return 'Calculating estimate…';

  if (!ok) return 'There was an error whilst fetching data.';

  if (status === NO_CONTENT) {
    return 'No data associated with this query.';
  }

  if (!payload) return 'An unexpected error was encountered.';

  const count = payload.count;
  if (count) {
    return (
      <>
        Your file will contain <NumberComponent abbr>{count}</NumberComponent>{' '}
        item
        {count > 1 ? 's' : ''}.
      </>
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
      <>
        Your file size will be <NumberComponent>{value}</NumberComponent>{' '}
        {suffix}
      </>
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
      headers: T.object, //TODO: change back instanceOf(Headers),
    }).isRequired,
    isStale: T.bool.isRequired,
  };

  render() {
    return (
      <section>
        <h6>Estimate</h6>
        {getText(this.props.data, this.props.isStale)}
      </section>
    );
  }
}
