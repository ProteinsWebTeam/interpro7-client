import React, { useState, useEffect } from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import local from '../style.css';

const f = foundationPartial(local);

const getTextAfterLastSlash = (text) => text.slice(1 + text.lastIndexOf('/'));

const SelectedParameter = ({ data, dataComponents, onRemove }) => {
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
      <span className={f('input-group-label')}>{data.name}</span>
      {inputType === 'select' && (
        <select className={f('input-group-field')} name={name}>
          {schema.enum.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      )}
      {inputType === 'checkbox' && (
        <input name={name} type="checkbox" className={f('input-group-field')} />
      )}
      {inputType === 'text' && (
        <input name={name} type="text" className={f('input-group-field')} />
      )}
      <div className={f('input-group-button')}>
        <button onClick={onRemove} className={f('button')}>
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
};
const URLParameters = ({ type, data }) => {
  const [selectedParameters, setSelectedParameters] = useState([]);
  useEffect(() => setSelectedParameters([]), [type]);

  if (data.loading || !data.ok || !data.payload) return null;
  const parameters = Object.fromEntries(
    (data.payload.paths?.[`/${type}/{sourceDB}`]?.get?.parameters || [])
      .filter((p) => p.$ref)
      .map((p) => {
        const key = getTextAfterLastSlash(p.$ref);
        return [key, data.payload.components.parameters?.[key]?.name];
      }),
  );
  const parametersToChoose = Object.keys(parameters).filter(
    (p) => p && selectedParameters.indexOf(p) === -1,
  );
  const addParameter = (evt) => {
    setSelectedParameters([...selectedParameters, evt.target.value]);
  };

  return (
    <div>
      <label>
        Add a modifier:
        <select value="" onChange={addParameter} onBlur={addParameter}>
          <option value="" disabled hidden style={{ color: 'gray' }}>
            Please Choose...
          </option>
          {parametersToChoose.map((p, i) => (
            <option key={i} value={p}>
              {parameters[p]}
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
              onRemove={() =>
                setSelectedParameters(
                  selectedParameters.filter((sp) => sp !== p),
                )
              }
              data={data.payload.components.parameters?.[p]}
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
  data: T.shape({
    loading: T.boolean,
    ok: T.boolean,
    payload: T.object,
  }),
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
