import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';
import { set } from 'lodash-es';

import DBChoiceInput from './DBChoiceInput';
import ApiLink from './ApiLink';
import TextExplanation from './TextExplanation';
import DataPreviewAndProgressProvider from './DataPreviewAndProgressProvider';
import Estimate from './Estimate';
import Snippet from './Snippet';
import Controls from './Controls';
import ProgressAnimation from './ProgressAnimation';

import pathToDescription from 'utils/processDescription/pathToDescription';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

const f = foundationPartial(local);

const extractDataFromHash = hash => {
  const [href, fileType, subset] = hash.split('|');
  const output = { fileType, subset: !!subset };
  try {
    output.description = pathToDescription(href);
  } catch {
    /**/
  }
  return output;
};

/*:: type Props = {
  matched: string,
  api: Object,
  lowGraphics: boolean,
  customLocation: Object,
  goToCustomLocation: function
}*/

export class DownloadForm extends PureComponent /*:: <Props> */ {
  static propTypes = {
    matched: T.string.isRequired,
    api: T.object.isRequired,
    lowGraphics: T.bool.isRequired,
    customLocation: T.object.isRequired,
    goToCustomLocation: T.func.isRequired,
    data: T.shape({
      loading: T.bool,
      payload: T.object,
    }),
  };

  /*::  _ref: { current: null | React$ElementRef<'form'> } */
  constructor(props /*: Props */) {
    super(props);
    this._ref = React.createRef();
    this.memberDb = {};
  }

  // eslint-disable-next-line complexity
  _handleChange = e => {
    if (!this._ref.current) return;
    const object = {};
    if (e.target instanceof HTMLButtonElement) {
      set(object, e.target.dataset.key, !!e.target.dataset.value);
      if (!e.target.dataset.value) {
        for (const input of this._ref.current.querySelectorAll(
          `input[data-reset="${e.target.dataset.reset}"], input[name="${e.target.dataset.key}"], select[name="${e.target.dataset.key}"]`,
        )) {
          input.value = '';
        }
      }
    }
    for (const { name, value, type, checked } of this._ref.current.elements) {
      if (name) {
        set(object, name, type === 'checkbox' ? checked : value);
      }
    }
    // Specific cases
    if (
      object.description.entry &&
      object.description.entry.db === 'interpro'
    ) {
      // remove integration from entry if db is InterPro, because it's useless
      object.description.entry.integration = null;
    }
    set(object.description, [object.description.main.key, 'isFilter'], null);
    let path;
    try {
      path = descriptionToPath(object.description);
      e.target.classList.remove(f('invalid-accession'));
    } catch {
      e.target.classList.add(f('invalid-accession'));
      return;
    }
    // More specific cases
    // Subset only available for fasta format, for proteins filtered by an entry
    if (
      object.subset &&
      !(
        object.fileType === 'fasta' &&
        object.description.entry.isFilter &&
        object.description.entry.accession
      )
    ) {
      object.subset = false;
    }
    if (
      object.fileType === 'fasta' &&
      object.description.main.key !== 'protein'
    ) {
      // Since we can only have fasta type for proteins, change type to default
      object.fileType = 'accession';
    }
    if (
      (object.fileType === 'fasta' || object.fileType === 'accession') &&
      !object.description[object.description.main.key].db
    ) {
      // Since we can only have counter objects in JSON, change type to default
      object.fileType = 'json';
    }
    const nextHash = [path, object.fileType, object.subset && 'subset']
      .filter(Boolean)
      .join('|');
    if (nextHash !== this.props.customLocation.hash) {
      this.props.goToCustomLocation({
        ...this.props.customLocation,
        hash: nextHash,
      });
    }
  };

  render() {
    const { matched, api, lowGraphics, data } = this.props;

    const { description, fileType, subset } = extractDataFromHash(matched);

    const endpoint = format({
      protocol: api.protocol,
      hostname: api.hostname,
      port: api.port,
      pathname: (api.root + descriptionToPath(description)).replace(
        /\/+/g,
        '/',
      ),
    });

    const typeObjects = Object.entries(description).filter(
      ([, { isFilter }]) => isFilter !== undefined,
    );

    const filters = typeObjects.filter(([, type]) => type.isFilter);

    const main = description.main.key || 'entry';

    if (!data?.loading && data?.payload) {
      this.memberDB = data.payload.databases;
    }

    return (
      <form
        onChange={this._handleChange}
        ref={this._ref}
        className={f('download-form')}
      >
        <h4>Select data</h4>
        <fieldset className={f('fieldset')}>
          <legend>Main data type</legend>
          <label>
            Choose a main data type:
            <select name="description.main.key" defaultValue={main}>
              {typeObjects.map(([type]) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <DBChoiceInput
            type={main}
            value={(description[main].db || '').toLowerCase()}
            valueIntegration={(
              description[main].integration || ''
            ).toLowerCase()}
            name={`description.${main}.db`}
            onClick={this._handleChange}
            databases={this.memberDB}
          />
        </fieldset>
        <fieldset className={f('fieldset')}>
          <legend>Filters</legend>
          <div>
            Add a filter:
            <div className={f('button-group')}>
              {typeObjects
                .filter(
                  ([type]) => type !== main && !description[type].isFilter,
                )
                .map(([type]) => (
                  <button
                    key={type}
                    type="button"
                    className={f('button')}
                    value={type}
                    data-key={`description.${type}.isFilter`}
                    data-value
                    onClick={this._handleChange}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
            </div>
            <ul className={f('no-bullet')}>
              {filters.map(([key, value]) => (
                <li key={key}>
                  <fieldset className={f('fieldset')}>
                    <legend>{key}</legend>
                    <label className={f('input-group')}>
                      <span className={f('input-group-label')}>
                        filter type:
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={key}
                        name={`description.${key}.isFilter`}
                        className={f('input-group-field')}
                      />
                      <div className={f('input-group-button')}>
                        <button
                          type="button"
                          data-key={`description.${key}.isFilter`}
                          className={f('button')}
                          onClick={this._handleChange}
                        >
                          x
                        </button>
                      </div>
                    </label>
                    <DBChoiceInput
                      type={key}
                      value={(value.db || '').toLowerCase()}
                      valueIntegration={(value.integration || '').toLowerCase()}
                      name={`description.${key}.db`}
                      onClick={this._handleChange}
                    />
                    <label className={f('input-group')}>
                      <span className={f('input-group-label')}>
                        {key} accession:
                      </span>
                      <input
                        type="text"
                        disabled={!description[key].db}
                        defaultValue={value.accession}
                        name={`description.${key}.accession`}
                        className={f('input-group-field')}
                        data-reset={`description.${key}`}
                      />
                      <div className={f('input-group-button')}>
                        <button
                          type="button"
                          data-key={`description.${key}.accession`}
                          className={f('button')}
                          onClick={this._handleChange}
                        >
                          x
                        </button>
                      </div>
                    </label>
                  </fieldset>
                </li>
              ))}
            </ul>
          </div>
        </fieldset>

        <h5>More info</h5>
        <ApiLink url={endpoint} />
        <DataPreviewAndProgressProvider
          url={endpoint}
          fileType={fileType}
          subset={subset}
        >
          {({ data, download, isStale }) => {
            const count = (data.payload && data.payload.count) || 0;
            const { db, integration } = description[main];
            const noData = count === 0 && (db !== null || integration !== null);
            return (
              <>
                <Estimate data={data} isStale={isStale} />
                {/* Only display if the response from the API is a list of items */}
                {description[main].db && !description[main].accession && (
                  <Snippet fileType={fileType} url={endpoint} subset={subset} />
                )}

                <div className={f('controls')}>
                  <h3>Download</h3>
                  <TextExplanation
                    fileType={fileType}
                    description={description}
                    subset={subset}
                    isStale={isStale}
                    count={count}
                    noData={noData}
                  />
                  <Controls
                    fileType={fileType}
                    subset={subset}
                    entityType={main}
                    url={endpoint}
                    download={download}
                    isStale={isStale}
                    count={count}
                    noData={noData}
                  />
                </div>
                {lowGraphics || <ProgressAnimation download={download} />}
              </>
            );
          }}
        </DataPreviewAndProgressProvider>
      </form>
    );
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  state => state.settings.api,
  state => state.settings.ui.lowGraphics,
  (customLocation, api, lowGraphics) => ({ customLocation, api, lowGraphics }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(loadData(getUrlForMeta)(DownloadForm));
