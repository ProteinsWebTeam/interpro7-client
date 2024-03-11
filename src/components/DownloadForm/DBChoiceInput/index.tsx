import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';
import { noop } from 'lodash-es';

import { toPlural } from 'utils/pages/toPlural';
import sortFnFor from 'utils/sort-functions/basic';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

import cssBinder from 'styles/cssBinder';
import InputGroup from '../InputGroup';

const css = cssBinder();
const integrationFlags = new Set(['all', 'integrated', 'unintegrated']);

const sortFn = sortFnFor({ selector: (tuple) => tuple[0] });

const payloadToOptions = (
  payload: Record<string, number | Record<string, number>>,
  isIntegration = false,
  memberDBs: DBsInfo,
) =>
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

type Props = {
  type: string;
  onClick: () => void;
  isIntegration?: boolean;
  name: string;
  value: string;
  valueIntegration: string;
  databases: DBsInfo;
};

interface LoadedProps extends Props, LoadDataProps<EndpointPayload> {}

export const DBChoiceInputWithoutData = (props: LoadedProps) => {
  const {
    type,
    data,
    onClick,
    isIntegration = false,
    name,
    value,
    valueIntegration,
    databases,
  } = props;
  if (!data) return null;
  const { loading, payload } = data;
  let integration;
  let _name = name;
  let _value = value;
  if (type === 'entry' && _value !== 'interpro') {
    if (isIntegration) {
      _name = name.replace('.db', '.integration');
      _value = valueIntegration;
    } else {
      integration = <DBChoiceInputWithoutData {...props} isIntegration />;
    }
  }
  return (
    <>
      <InputGroup
        label={
          <>
            {type} {isIntegration ? 'integration' : 'DB'}:
          </>
        }
        input={
          <>
            {!loading && payload ? (
              <select
                className={css('input-group-field')}
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
            ) : (
              <input type="hidden" name={_name} value={_value} />
            )}
          </>
        }
        button={
          <button
            type="button"
            data-key={_name}
            className={css('button')}
            onClick={onClick}
          >
            Clear
          </button>
        }
      />
      {integration}
    </>
  );
};

const mapStateToUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (_: GlobalState, props: Props) => props.type,
  ({ protocol, hostname, port, root }, type) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/${type}`,
      }),
    ),
);

export default loadData(mapStateToUrlFor as Params)(DBChoiceInputWithoutData);
