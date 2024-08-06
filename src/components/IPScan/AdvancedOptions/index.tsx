import React, { useRef } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';

import Button from 'components/SimpleCommonComponents/Button';
import ToggleSwitch from 'components/ToggleSwitch';

import AdvancedOption from './AdvancedOption';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import localParent from '../Search/style.css';

const css = cssBinder(local, localParent);

const mdb1Values = new Set([
  'CDD',
  'HAMAP',
  'Panther',
  'PfamA',
  'PIRSF',
  'PRINTS',
  'PrositeProfiles',
  'SMART',
  'NCBIfam',
  'PrositePatterns',
  'SFLD',
]);
const mdb2Values = new Set(['Gene3d', 'SuperFamily']);
const otherValues = new Set([
  'Coils',
  'MobiDBLite',
  'Phobius',
  'SignalP',
  'TMHMM',
]);
const ignoreList = new Set();

const labels = new Map([
  ['PfamA', 'Pfam'],
  ['Panther', 'PANTHER'],
  ['SuperFamily', 'SUPERFAMILY'],
  ['Gene3d', 'CATH-Gene3D'],
  ['PrositeProfiles', 'PROSITE profiles'],
  ['PrositePatterns', 'PROSITE patterns'],
]);

const groupApplications = (
  applications: Array<IprscanParameterValue>,
  initialOptions?: InterProLocationSearch,
) => {
  const mdb1 = [];
  const mdb2 = [];
  const other = [];
  const noCategory = [];
  const appOptions = initialOptions?.applications as Array<string>;
  for (const application of applications) {
    if (appOptions?.length) {
      application.defaultValue = appOptions.includes(application.value);
    }
    if (mdb1Values.has(application.value)) mdb1.push(application);
    else if (mdb2Values.has(application.value)) mdb2.push(application);
    else if (otherValues.has(application.value)) other.push(application);
    else if (!ignoreList.has(application.value)) noCategory.push(application);
  }
  return { mdb1, mdb2, other, noCategory };
};

const applicationToCheckbox = ({
  value,
  defaultValue,
  properties,
}: {
  value: string;
  defaultValue: boolean;
  properties: { properties: Array<{ value: string }> };
}) => (
  <AdvancedOption
    name="appl"
    value={value}
    defaultChecked={defaultValue}
    title={properties && properties.properties[0].value}
    key={value}
  >
    {labels.get(value) || value}
  </AdvancedOption>
);

const toggleAll = (checked: boolean, node: HTMLElement | null) => {
  if (!node) return;
  for (const checkbox of node.querySelectorAll<HTMLInputElement>(
    'input[name="appl"]',
  )) {
    checkbox.checked = checked;
  }
};

type Props = {
  title?: string;
  initialOptions?: InterProLocationSearch;
  changeTitle: () => void;
};

interface LoadedProps
  extends Props,
    LoadDataProps<IprscanParametersDetailsPayload> {}

export const AdvancedOptions = ({
  data,
  title,
  initialOptions,
  changeTitle,
}: LoadedProps) => {
  const fieldSetRef = useRef<HTMLFieldSetElement>(null);
  if (!data) return null;
  const { loading, payload, ok } = data;
  if (loading) return 'Loading…';
  if (!ok || !payload) return 'Failed…';
  const { mdb1, mdb2, other, noCategory } = groupApplications(
    payload.values.values,
    initialOptions,
  );
  const selectAll = (event: Event) => {
    event.preventDefault();
    toggleAll(true, fieldSetRef.current);
  };

  const unselectAll = (event: Event) => {
    event.preventDefault();
    toggleAll(false, fieldSetRef.current);
  };

  return (
    <section>
      <details className={css('option-style')}>
        <summary>
          <span className={css('triangle')}>►</span>
          <span>Advanced options</span>
        </summary>
        <fieldset className={css('new-fieldset')}>
          <legend>Job configuration</legend>
          <label style={{ marginBottom: '1rem' }}>
            <ToggleSwitch
              id="seqtype"
              name="seqtype"
              switchCond={false}
              label="Sequence type:"
              size="small"
              offValue="protein (amino acids)"
              onValue="DNA/RNA (nucleotides)"
              width="8rem"
            />
          </label>
          <br />
          <label style={{ marginBottom: '1rem' }}>
            <ToggleSwitch
              id="stay"
              name="stay"
              switchCond={false}
              label="Create another job after this one:"
              size="small"
            />
          </label>
          <label className={css('new-input-group')}>
            <span className={css('new-input-group-label')}>Job title</span>
            <input
              type="text"
              className={css('input-group-field')}
              name="local-title"
              defaultValue={title}
              onChange={changeTitle}
              placeholder="Give this job a local title (only visible on this browser)"
            />
          </label>
        </fieldset>
        <fieldset className={css('new-fieldset')} ref={fieldSetRef}>
          <legend>Applications</legend>
          <p>{payload.description}</p>
          <div className={css('button-group', 'line-with-buttons')}>
            <Button type="tertiary" onClick={selectAll}>
              Select all
            </Button>
            <Button type="tertiary" onClick={unselectAll}>
              Unselect all
            </Button>
          </div>
          <fieldset className={css('new-fieldset')}>
            <legend>Member databases</legend>
            <fieldset className={css('new-fieldset')}>
              <legend>Families, domains, sites & repeats</legend>
              {mdb1.map(applicationToCheckbox)}
            </fieldset>
            <fieldset className={css('new-fieldset')}>
              <legend>Structural domains</legend>
              {mdb2.map(applicationToCheckbox)}
            </fieldset>
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>Other sequence features</legend>
            {other.map(applicationToCheckbox)}
            {noCategory.map(applicationToCheckbox)}
          </fieldset>
        </fieldset>
      </details>
    </section>
  );
};

const getUrlFromState = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/parameterdetails/appl`,
    }),
);

export default loadData(getUrlFromState as LoadDataParameters)(AdvancedOptions);
