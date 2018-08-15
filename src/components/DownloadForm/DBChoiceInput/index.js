import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import { toPlural } from 'utils/pages';

import loadData from 'higherOrder/loadData';

import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

const payloadToOptions = payload =>
  Object.entries(payload).map(([key, value]) => {
    if (typeof value !== 'object') {
      return (
        <option key={key} value={key.toLowerCase()}>
          {key}
        </option>
      );
    }
    return (
      <optgroup key={key} label={key.replace('_', ' ')}>
        {payloadToOptions(value)}
      </optgroup>
    );
  });

export class DBChoiceInputWithoutData extends PureComponent {
  static propTypes = {
    type: T.string.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    isStale: T.bool.isRequired,
  };

  render() {
    const {
      type,
      data: { loading, payload },
      isStale: _,
      ...props
    } = this.props;
    if (loading) return 'Loading…';
    if (!payload) return 'Error…';
    return (
      <select {...props}>
        <option value="">{'< no selection >'}</option>
        {payloadToOptions(payload[toPlural(type)])}
      </select>
    );
  }
}

const mapStateToUrlFor = createSelector(
  type => type,
  type =>
    createSelector(
      state => state.settings.api,
      ({ protocol, hostname, port, root }) =>
        cleanUpMultipleSlashes(
          format({
            protocol,
            hostname,
            port,
            pathname: `${root}/${type}`,
          }),
        ),
    ),
);

export default class DBChoiceInput extends PureComponent {
  static propTypes = {
    type: T.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      DBChoiceInputWithData: null,
      type: null,
    };
  }

  static getDerivedStateFromProps({ type }, prevState) {
    if (type === prevState.type) return null;

    return {
      DBChoiceInputWithData: loadData(mapStateToUrlFor(type))(
        DBChoiceInputWithoutData,
      ),
      type,
    };
  }

  render() {
    const { DBChoiceInputWithData } = this.state;
    return <DBChoiceInputWithData {...this.props} />;
  }
}
