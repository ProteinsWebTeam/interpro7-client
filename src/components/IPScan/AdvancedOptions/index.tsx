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

/* Application categories used to group the checkboxes in the UI. The names
match the values returned by the InterProScan `parameterdetails/appl`
endpoint. Only applications that need a dedicated section are listed here;
anything else is treated as a member database and shown under
"Families, domains, sites & repeats". */
const APPLICATION_CATEGORIES = {
  structuralDomains: new Set(['CATH-Gene3D', 'SUPERFAMILY']),
  functionalFamilies: new Set(['CATH-FunFam']),
  coiledCoil: new Set(['COILS']),
  disorderedRegions: new Set(['MobiDB-lite']),
  signalAndTransmembrane: new Set(['Phobius', 'SignalP-Euk', 'SignalP-Prok']),
  spuriousProteins: new Set(['AntiFam']),
  additionalSites: new Set(['PIRSR']),
} as const;

type ApplicationCategory = keyof typeof APPLICATION_CATEGORIES | 'families';

const categoryFor = (value: string): ApplicationCategory => {
  for (const [category, values] of Object.entries(APPLICATION_CATEGORIES)) {
    if (values.has(value)) return category as ApplicationCategory;
  }
  // Default: treat unknown applications as member databases.
  return 'families';
};

type GroupedApplications = Record<
  ApplicationCategory,
  Array<IprscanParameterValue>
>;

const sortOptions = (a: IprscanParameterValue, b: IprscanParameterValue) =>
  (a.label || a.value).localeCompare(b.label || b.value);

const groupApplications = (
  applications: Array<IprscanParameterValue>,
  initialOptions?: InterProLocationSearch,
): GroupedApplications => {
  const groups: GroupedApplications = {
    families: [],
    structuralDomains: [],
    functionalFamilies: [],
    coiledCoil: [],
    disorderedRegions: [],
    signalAndTransmembrane: [],
    spuriousProteins: [],
    additionalSites: [],
  };
  const appOptions = initialOptions?.applications as Array<string>;

  for (const application of applications) {
    if (appOptions?.length) {
      application.defaultValue = appOptions.includes(application.value);
    }
    groups[categoryFor(application.value)].push(application);
  }

  for (const category of Object.keys(groups) as Array<ApplicationCategory>) {
    groups[category].sort(sortOptions);
  }
  return groups;
};

const applicationToCheckbox = ({
  value,
  label,
  defaultValue,
  properties,
}: IprscanParameterValue) => (
  <AdvancedOption
    name="appl"
    value={value}
    defaultChecked={defaultValue}
    title={properties?.properties?.[0]?.value}
    key={value}
  >
    {label || value}
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
  const groups = groupApplications(payload.values.values, initialOptions);
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
              width="11rem"
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
              {groups.families.map(applicationToCheckbox)}
            </fieldset>
            <fieldset className={css('new-fieldset')}>
              <legend>Structural domains</legend>
              {groups.structuralDomains.map(applicationToCheckbox)}
            </fieldset>
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>CATH-based functional families</legend>
            {groups.functionalFamilies.map(applicationToCheckbox)}
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>Coiled-coil regions</legend>
            {groups.coiledCoil.map(applicationToCheckbox)}
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>Intrinsically disordered regions</legend>
            {groups.disorderedRegions.map(applicationToCheckbox)}
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>Signal peptides and transmembrane regions</legend>
            {groups.signalAndTransmembrane.map(applicationToCheckbox)}
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>Spurious proteins</legend>
            {groups.spuriousProteins.map(applicationToCheckbox)}
          </fieldset>
          <fieldset className={css('new-fieldset')}>
            <legend>Additional conserved site annotations</legend>
            {groups.additionalSites.map(applicationToCheckbox)}
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
