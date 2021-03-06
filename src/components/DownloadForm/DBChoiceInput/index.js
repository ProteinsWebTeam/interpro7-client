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

const sortFn = sortFnFor({ selector: (tuple) => tuple[0] });

const payloadToOptions = (payload, isIntegration = false, memberDBs) =>
  Object.entries(payload)
    .filter(([key]) => integrationFlags.has(key) === isIntegration)
    .sort(sortFn)
    .map(([key, value]) => {
      if (typeof value !== 'object') {
        return (
          <option key={key} value={key.toLowerCase()}>
            {memberDBs && memberDBs[key]
              ? memberDBs[key].name
              : key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        );
      }
      return (
        <optgroup key={key} label={key.replace('_', ' ')}>
          {payloadToOptions(value, isIntegration, memberDBs)}
        </optgroup>
      );
    });

/*:: type Props = {
  type: string,
  data: {
    loading: boolean,
    payload: Object
  },
  isStale: boolean,
  onClick: function,
  isIntegration: boolean,
  name: string,
  value: string,
  valueIntegration: string,
  databases: Object,
};*/

export class DBChoiceInputWithoutData extends PureComponent /*:: <Props> */ {
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
    databases: T.object,
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
      databases,
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
          {(!loading && payload && (
            <select
              className={f('input-group-field')}
              name={_name}
              value={_value}
              onChange={noop}
              onBlur={noop}
            >
              <option value="">{'< no selection >'}</option>
              {payloadToOptions(
                payload[toPlural(type)],
                isIntegration,
                databases,
              )}
            </select>
          )) || <input type="hidden" name={_name} value={_value} />}
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
  (type) => type,
  (type) =>
    createSelector(
      (state) => state.settings.api,
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

/* :: type DBChoiceInputProps =  {type: string} */
/* :: type DBChoiceInputState =  {DBChoiceInputWithData: any, type: ?string} */

export default class DBChoiceInput extends PureComponent /*:: <DBChoiceInputProps, DBChoiceInputState> */ {
  static propTypes = {
    type: T.string.isRequired,
  };
  constructor(props /*: DBChoiceInputProps */) {
    super(props);

    this.state = {
      DBChoiceInputWithData: null,
      type: null,
    };
  }

  static getDerivedStateFromProps(
    { type } /*: DBChoiceInputState */,
    prevState /*: DBChoiceInputState */,
  ) {
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
