import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';
import { noop } from 'lodash-es';

import { toPlural } from 'utils/pages';
import sortFnFor from 'utils/sort-functions/basic';

import loadData from 'higherOrder/loadData';

import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

import f from 'styles/foundation';

const integrationFlags = new Set(['all', 'integrated', 'unintegrated']);

const sortFn = sortFnFor({ selector: tuple => tuple[0] });

const payloadToOptions = (payload, isIntegration = false) =>
  Object.entries(payload)
    .filter(([key]) => integrationFlags.has(key) === isIntegration)
    .sort(sortFn)
    .map(([key, value]) => {
      if (typeof value !== 'object') {
        return (
          <option key={key} value={key.toLowerCase()}>
            {key}
          </option>
        );
      }
      return (
        <optgroup key={key} label={key.replace('_', ' ')}>
          {payloadToOptions(value, isIntegration)}
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
    onClick: T.func.isRequired,
    isIntegration: T.bool,
    name: T.string.isRequired,
    value: T.string.isRequired,
    valueIntegration: T.string.isRequired,
  };

  render() {
    const {
      type,
      data: { loading, payload },
      isStale: _,
      onClick,
      isIntegration,
      name,
      value,
      valueIntegration,
    } = this.props;
    let integration;
    let _name = name;
    let _value = value;
    if (type === 'entry' && _value !== 'interpro') {
      if (isIntegration) {
        _name = name.replace('.db', '.integration');
        _value = valueIntegration;
      } else {
        integration = (
          <DBChoiceInputWithoutData {...this.props} isIntegration />
        );
      }
    }
    return (
      <>
        <label className={f('input-group')}>
          <span className={f('input-group-label')}>
            {type} {isIntegration ? 'integration' : 'DB'}:
          </span>
          {(!loading &&
            payload && (
              <select
                className={f('input-group-field')}
                name={_name}
                value={_value}
                onChange={noop}
                onBlur={noop}
              >
                <option value="">{'< no selection >'}</option>
                {payloadToOptions(payload[toPlural(type)], isIntegration)}
              </select>
            )) || <input />}
          <div className={f('input-group-button')}>
            <button
              type="button"
              data-key={_name}
              className={f('button')}
              onClick={onClick}
            >
              x
            </button>
          </div>
        </label>
        {integration}
      </>
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
