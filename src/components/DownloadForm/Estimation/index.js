import React, { PureComponent } from 'react';
import T from 'prop-types';
import filesize from 'filesize';

import loadData from 'higherOrder/loadData';

const NO_CONTENT = 204;
const PRECISION_THRESHOLD = 300;
const ONE_K = 1024;

export class EstimationWithoutData extends PureComponent {
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
    const {
      data: { loading, payload, ok, status, headers },
    } = this.props;

    if (loading) return 'Getting estimation from server…';

    if (!ok) return 'An error happened during the request to the server.';

    if (status === NO_CONTENT) {
      return 'No data was found for this specific query.';
    }

    if (!payload) return 'An unexpected error happened.';

    const count = payload.count;
    if (count) {
      return `Your file will contain ${
        count > PRECISION_THRESHOLD ? 'approximately ' : ''
      }${count} item${count > 1 ? 's' : ''}.`;
    }

    let size = +headers.get('content-length');
    if (!size) {
      size = JSON.stringify(payload, null, 2).length;
    }
    if (size && Number.isFinite(size)) {
      return `Your file size will be of ${
        size > ONE_K ? 'approximately ' : ''
      }${filesize(size, { round: 0, standard: 'iec' })}.`;
    }

    return 'No estimation available.';
  }
}

export default class Estimation extends PureComponent {
  static propTypes = {
    url: T.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      EstimationWithData: null,
      url: null,
    };
  }

  static getDerivedStateFromProps({ url }, prevState) {
    if (url === prevState.url) return null;

    return {
      EstimationWithData: loadData(() => url)(EstimationWithoutData),
      url,
    };
  }

  render() {
    const { EstimationWithData } = this.state;
    return (
      <section>
        <h6>Estimation</h6>
        <EstimationWithData />
      </section>
    );
  }
}
