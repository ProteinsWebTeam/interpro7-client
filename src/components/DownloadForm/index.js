import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';
import set from 'lodash-es/set';

import Link from 'components/generic/Link';

import pathToDescription from 'utils/processDescription/pathToDescription';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';

const f = foundationPartial(local);

const extractDataFromHash = hash => {
  const [href, fileType] = hash.split('|');
  const output = { fileType };
  try {
    output.description = pathToDescription(href);
  } catch (_) {
    /**/
  }
  return output;
};

class DownloadForm extends PureComponent {
  static propTypes = {
    matched: T.string.isRequired,
    api: T.object.isRequired,
    customLocation: T.object.isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  _handleChange = e => {
    if (!this._ref.current) return;
    const object = {};
    if (e.target instanceof HTMLButtonElement) {
      set(object, e.target.dataset.key, !!e.target.dataset.value);
      if (!e.target.dataset.value) {
        for (const input of this._ref.current.querySelectorAll(
          `input[data-reset="${e.target.dataset.reset}"], input[name="${
            e.target.dataset.key
          }"]`,
        )) {
          input.value = '';
        }
      }
    }
    for (const { name, value } of this._ref.current.elements) {
      if (name) set(object, name, value);
    }
    set(object.description, [object.description.main.key, 'isFilter'], null);
    let description;
    try {
      description = descriptionToPath(object.description);
    } catch (_) {
      return;
    }
    const nextHash = [description, object.fileType].join('|');
    if (nextHash !== this.props.customLocation.hash) {
      this.props.goToCustomLocation({
        ...this.props.customLocation,
        hash: nextHash,
      });
    }
  };

  render() {
    const { matched, api } = this.props;

    const { description, fileType } = extractDataFromHash(matched);

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

    let sentence = `This ${fileType} file will contain information about`;
    // TODO: to be continued

    return (
      <form onChange={this._handleChange} ref={this._ref}>
        <h4>Generate a new file</h4>
        <fieldset className={f('fieldset')}>
          <legend>Main type</legend>
          <label>
            Choose a main type:
            <select name="description.main.key" defaultValue={main}>
              {typeObjects.map(([type]) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className={f('input-group')}>
            <span className={f('input-group-label')}>{main} DB:</span>
            <input
              type="text"
              defaultValue={description[main].db}
              name={`description.${main}.db`}
              className={f('input-group-field')}
            />
            <div className={f('input-group-button')}>
              <button
                type="button"
                data-key={`description.${main}.db`}
                className={f('button')}
                onClick={this._handleChange}
              >
                x
              </button>
            </div>
          </label>
        </fieldset>
        <fieldset className={f('fieldset')}>
          <legend>Filters</legend>
          <div>
            Add a filter:
            <div className={f('button-group')}>
              {typeObjects
                .filter(
                  ([type]) =>
                    type !== description.main.key &&
                    !description[type].isFilter,
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
                    {type}
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
                    <label className={f('input-group')}>
                      <span className={f('input-group-label')}>{key} DB:</span>
                      <input
                        type="text"
                        defaultValue={value.db}
                        name={`description.${key}.db`}
                        className={f('input-group-field')}
                        data-reset={`description.${key}`}
                      />
                      <div className={f('input-group-button')}>
                        <button
                          type="button"
                          data-key={`description.${key}.db`}
                          className={f('button')}
                          onClick={this._handleChange}
                          data-reset={`description.${key}`}
                        >
                          x
                        </button>
                      </div>
                    </label>
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
        <div>Corresponding API call:</div>
        <div>
          <Link href={endpoint} target="_blank">
            <code>{endpoint}</code>
          </Link>
        </div>
        <div>{sentence}</div>
        <pre>{JSON.stringify(description, null, 2)}</pre>
        <fieldset className={f('controls')}>
          <legend>Download</legend>
          <label>
            Download type
            <select name="fileType" defaultValue={fileType || 'json'}>
              <option value="json">JSON</option>
              <option value="tsv">TSV</option>
              <option value="fasta">FASTA</option>
              <option value="accession">Accession</option>
            </select>
          </label>
          <button type="button" className={f('button')}>
            Generate
          </button>
          <button type="button" className={f('button')} disabled>
            Download
          </button>
        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  state => state.settings.api,
  (customLocation, api) => ({ customLocation, api }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(DownloadForm);
