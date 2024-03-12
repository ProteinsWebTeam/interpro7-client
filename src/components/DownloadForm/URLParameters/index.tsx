import React, { useState, useEffect, FormEvent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

import SelectedParameter, { getTextAfterLastSlash } from './SelectedParameter';

import cssBinder from 'styles/cssBinder';

import local from '../style.css';

const css = cssBinder(local);

type Props = {
  type: string;
  search?: Record<string, string>;
  onChange: (event: FormEvent) => void;
};
interface LoadedProps extends Props, LoadDataProps<OpenAPIPayload> {}

const URLParameters = ({ type, data, search, onChange }: LoadedProps) => {
  const [toAdd, setToAdd] = useState<string | null>(null);
  const [toRemove, setToRemove] = useState<string | null>(null);
  const payloadIsReady = !!data && !data.loading && data.ok && !!data.payload;
  useEffect(() => {
    if (toAdd) setToAdd(null);
  });
  useEffect(() => {
    return () =>
      payloadIsReady
        ? onChange({ target: null } as unknown as FormEvent)
        : undefined;
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
  if (!payloadIsReady) return null;
  const parameters = Object.fromEntries(
    (data.payload?.paths?.[`/${type}/{sourceDB}`]?.get?.parameters || [])
      .filter((p) => p.$ref)
      .map((p) => {
        const key = getTextAfterLastSlash(p.$ref || '');
        return [data.payload?.components.parameters?.[key]?.name, key];
      }),
  );
  const parametersToChoose = Object.keys(parameters).filter(
    (p) => p && selectedParameters.indexOf(p) === -1,
  );
  const handleChange = (evt: FormEvent) => {
    setToAdd((evt.target as HTMLSelectElement).value);
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
        <fieldset className={css('fieldset')}>
          <legend>Active Modifiers</legend>
          {selectedParameters.map((p) => (
            <SelectedParameter
              key={p}
              value={search?.[p]}
              onChange={onChange}
              onRemove={() => setToRemove(p)}
              data={data.payload?.components.parameters?.[parameters[p]]}
              dataComponents={data.payload?.components}
            />
          ))}
        </fieldset>
      )}
    </div>
  );
};

const getURLforOpenAPI = createSelector(
  (state: GlobalState) => state.settings.api,
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
} as Params)(URLParameters);
