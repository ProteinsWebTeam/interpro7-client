import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import loadData from 'higherOrder/loadData';
import { detailsTag as detailsTagPolyfill } from 'utils/polyfills';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';

const f = foundationPartial(local);

/*:: type Props = {
  name: string,
  value: string,
  children: string,
  title?: string,
  defaultChecked: boolean
}; */

/*:: type State = {
  checked: boolean
}; */

class AdvancedOption extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    name: T.string.isRequired,
    value: T.string.isRequired,
    children: T.string.isRequired,
    title: T.string,
    defaultChecked: T.bool,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      checked: !!props.defaultChecked,
    };
  }

  render() {
    const { name, value, children, title, defaultChecked } = this.props;
    const output = (
      <label>
        <input
          name={name}
          defaultChecked={defaultChecked}
          type="checkbox"
          value={value}
          data-defaultchecked={defaultChecked}
        />
        {children}
      </label>
    );
    if (!title) return output;
    return <Tooltip title={title}>{output}</Tooltip>;
  }
}

const mdb1Values = new Set([
  'CDD',
  'HAMAP',
  'Panther',
  'PfamA',
  'PIRSF',
  'PRINTS',
  'PrositeProfiles',
  'SMART',
  'TIGRFAM',
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
const ignoreList = new Set(['ProDom']);

const labels = new Map([
  ['PfamA', 'Pfam'],
  ['Panther', 'PANTHER'],
  ['SuperFamily', 'SUPERFAMILY'],
  ['Gene3d', 'CATH-Gene3D'],
  ['TIGRFAM', 'TIGRFAMs'],
  ['PrositeProfiles', 'PROSITE profiles'],
  ['PrositePatterns', 'PROSITE patterns'],
]);
const groupApplications = (applications, initialOptions) => {
  const mdb1 = [];
  const mdb2 = [];
  const other = [];
  const noCategory = [];
  for (const application of applications) {
    if (initialOptions?.applications?.length) {
      application.defaultValue = initialOptions.applications.includes(
        application.value,
      );
    }
    if (mdb1Values.has(application.value)) mdb1.push(application);
    else if (mdb2Values.has(application.value)) mdb2.push(application);
    else if (otherValues.has(application.value)) other.push(application);
    else if (!ignoreList.has(application.value)) noCategory.push(application);
  }
  return { mdb1, mdb2, other, noCategory };
};

const applicationToCheckbox = (
  {
    value,
    defaultValue,
    properties,
  } /*: {value: string, defaultValue: boolean, properties: {properties: Array<Object>}} */,
) => (
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
applicationToCheckbox.propTypes = {
  value: T.string.isRequired,
  defaultValue: T.bool.isRequired,
  properties: T.shape({
    properties: T.arrayOf(
      T.shape({
        value: T.string.isRequired,
      }),
    ).isRequired,
  }),
};

const toggleAll = (toggle, node) => {
  if (!node) return;
  for (const checkbox of node.querySelectorAll('input[name="appl"]')) {
    checkbox.checked = toggle;
  }
};
/*:: type AdvancedOptionsProps = {
  data: {
    loading: boolean,
    payload: Object,
    ok: boolean
  },
  title: string,
}*/

export class AdvancedOptions extends PureComponent /*:: <AdvancedOptionsProps> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'fieldset'> };
  */
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
      ok: T.bool,
    }).isRequired,
    title: T.string,
    changeTitle: T.func,
    initialOptions: T.object,
  };

  constructor(props /*: AdvancedOptionsProps */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    detailsTagPolyfill();
  }

  _selectAll = (event) => {
    event.preventDefault();
    toggleAll(true, this._ref.current);
  };

  _unselectAll = (event) => {
    event.preventDefault();
    toggleAll(false, this._ref.current);
  };

  render() {
    const {
      data: { loading, payload, ok },
      title,
      initialOptions,
    } = this.props;
    if (loading) return 'Loading…';
    if (!ok) return 'Failed…';
    const { mdb1, mdb2, other, noCategory } = groupApplications(
      payload.values.values,
      initialOptions,
    );
    return (
      <div className={f('row')}>
        <details
          className={f('columns', 'margin-bottom-medium', 'option-style')}
        >
          <summary>Advanced options</summary>
          <fieldset className={f('fieldset')}>
            <legend>Job configuration</legend>
            <Tooltip title="Stay on this page after submitting a new job?">
              <label className={f('stay-checkbox')}>
                <div className={f('switch', 'tiny')}>
                  <input
                    className={f('switch-input')}
                    type="checkbox"
                    name="stay"
                  />
                  <span className={f('switch-paddle')}>
                    <span />
                  </span>
                </div>
                Create another job after this one
              </label>
            </Tooltip>
            <Tooltip title="Give this job a local title (only visible on this browser)">
              <label className={f('input-group')}>
                <span className={f('input-group-label')}>Job title</span>
                <input
                  type="text"
                  className={f('input-group-field')}
                  name="local-title"
                  defaultValue={title}
                  onChange={this.props.changeTitle}
                />
              </label>
            </Tooltip>
          </fieldset>
          <fieldset className={f('fieldset')} ref={this._ref}>
            <legend>Applications</legend>
            <p>{payload.description}</p>
            <div className={f('button-group')}>
              <button
                className={f('button', 'secondary')}
                onClick={this._selectAll}
              >
                Select all
              </button>
              <button
                className={f('button', 'secondary')}
                onClick={this._unselectAll}
              >
                Unselect all
              </button>
            </div>
            <fieldset className={f('fieldset')}>
              <legend>Member databases</legend>
              <fieldset className={f('fieldset')}>
                <legend>Families, domains, sites & repeats</legend>
                {mdb1.map(applicationToCheckbox)}
              </fieldset>
              <fieldset className={f('fieldset')}>
                <legend>Structural domains</legend>
                {mdb2.map(applicationToCheckbox)}
              </fieldset>
            </fieldset>
            <fieldset className={f('fieldset')}>
              <legend>Other sequence features</legend>
              {other.map(applicationToCheckbox)}
            </fieldset>
            {noCategory.length ? (
              <fieldset className={f('fieldset')}>
                <legend>Other category</legend>
                {noCategory.map(applicationToCheckbox)}
              </fieldset>
            ) : null}
          </fieldset>
        </details>
      </div>
    );
  }
}

const getUrlFromState = createSelector(
  (state) => state.settings.ipScan,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/parameterdetails/appl`,
    }),
);

export default loadData(getUrlFromState)(AdvancedOptions);
