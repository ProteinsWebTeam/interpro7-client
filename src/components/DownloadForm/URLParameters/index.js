import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';
import { noop } from 'lodash-es';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

import local from '../style.css';

const f = foundationPartial(local, fonts);

const getTextAfterLastSlash = (text) => text.slice(1 + text.lastIndexOf('/'));

const SelectedParameter = ({
  data,
  dataComponents,
  value,
  onRemove,
  onChange,
}) => {
  const buttonEl = useRef(null);
  useEffect(() => {
    onChange({ target: buttonEl.current });
  }, []);
  let inputType = 'text';
  let schema = data.schema;
  if (data.schema.$ref) {
    const key = getTextAfterLastSlash(data.schema.$ref);
    schema = dataComponents.schemas[key];
  }

  if (schema.type === 'string' && schema.enum) {
    if (schema.enum.length === 1) inputType = 'checkbox';
    else inputType = 'select';
  }
  const name = `search.${data.name}`;
  return (
    <label className={f('input-group')}>
      <span className={f('input-group-label')}>
        {data.name}{' '}
        <Tooltip title={`<pre>${data.description}</pre>`}>
          <span
            className={f('small', 'icon', 'icon-common')}
            data-icon="&#xf129;"
            aria-label={`description for attribute: ${data.name}`}
          />
        </Tooltip>
      </span>
      {inputType === 'select' && (
        <select
          className={f('input-group-field')}
          name={name}
          value={value}
          onChange={noop}
          onBlur={noop}
        >
          {schema.enum.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      )}
      {inputType === 'checkbox' && (
        <input
          name={name}
          type="text"
          readOnly
          className={f('input-group-field')}
          value={data.name}
        />
      )}
      {inputType === 'text' && (
        <input
          value={value}
          onChange={noop}
          onBlur={noop}
          name={name}
          type="text"
          className={f('input-group-field')}
        />
      )}
      <div className={f('input-group-button')}>
        <button onClick={onRemove} className={f('button')} ref={buttonEl}>
          X
        </button>
      </div>
    </label>
  );
};
SelectedParameter.propTypes = {
  data: T.object,
  dataComponents: T.object,
  onRemove: T.func,
  onChange: T.func,
  value: T.string,
};

const URLParameters = ({ type, data, search, onChange }) => {
  const [toAdd, setToAdd] = useState(null);
  const [toRemove, setToRemove] = useState(null);
  useEffect(() => {
    if (toAdd) setToAdd(null);
  });
  useEffect(() => {
    return () => onChange({ target: null });
  }, [toRemove]);
  const selectedParameters = Object.keys(search || {});
  if (toAdd) {
    selectedParameters.push(toAdd);
  }
  if (toRemove) {
    const pos = selectedParameters.indexOf(toRemove);
    if (pos >= 0) {
      selectedParameters.splice(pos, 1);
    } else {
      setToRemove(null);
    }
  }
  if (data.loading || !data.ok || !data.payload) return null;
  const parameters = Object.fromEntries(
    (data.payload.paths?.[`/${type}/{sourceDB}`]?.get?.parameters || [])
      .filter((p) => p.$ref)
      .map((p) => {
        const key = getTextAfterLastSlash(p.$ref);
        return [data.payload.components.parameters?.[key]?.name, key];
      }),
  );
  const parametersToChoose = Object.keys(parameters).filter(
    (p) => p && selectedParameters.indexOf(p) === -1,
  );
  const handleChange = (evt) => {
    setToAdd(evt.target.value);
  };

  return (
    <div>
      <label>
        Add a modifier:
        <select
          name="add_modifier"
          value=""
          onChange={handleChange}
          onBlur={handleChange}
        >
          <option value="" disabled hidden style={{ color: 'gray' }}>
            Please Choose...
          </option>
          {parametersToChoose.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      {selectedParameters && selectedParameters.length > 0 && (
        <fieldset className={f('fieldset')}>
          <legend>Active Modifiers</legend>
          {selectedParameters.map((p) => (
            <SelectedParameter
              key={p}
              value={search?.[p]}
              onChange={onChange}
              onRemove={() => setToRemove(p)}
              data={data.payload.components.parameters?.[parameters[p]]}
              dataComponents={data.payload.components}
            />
          ))}
        </fieldset>
      )}
    </div>
  );
};
URLParameters.propTypes = {
  type: T.string.isRequired,
  search: T.object,
  data: T.shape({
    loading: T.boolean,
    ok: T.boolean,
    payload: T.object,
  }),
  onChange: T.func,
};

const getURLforOpenAPI = createSelector(
  (state) => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/utils/openapi`,
      }),
    ),
);

export default loadData({
  getUrl: getURLforOpenAPI,
  fetchOptions: {
    responseType: 'yaml',
  },
})(URLParameters);
