import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';
import set from 'lodash-es/set';
import noop from 'lodash-es/noop';

import Link from 'components/generic/Link';

import pathToDescription from 'utils/processDescription/pathToDescription';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import f from 'styles/foundation';

const extractDataFromHash = hash => {
  const [href] = hash.split('|');
  const output = {};
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

  _handleChange = e => {
    const description = {};
    for (const { name, value } of e.currentTarget.elements) {
      set(description, name, value);
    }
    const nextHash = descriptionToPath(description);
    if (nextHash !== this.props.customLocation.hash) {
      this.props.goToCustomLocation({
        ...this.props.customLocation,
        hash: nextHash,
      });
    }
  };

  render() {
    const { matched, api } = this.props;

    const { description } = extractDataFromHash(matched);

    const endpoint = format({
      protocol: api.protocol,
      hostname: api.hostname,
      port: api.port,
      pathname: (api.root + descriptionToPath(description)).replace(
        /\/+/g,
        '/',
      ),
    });

    const types = Object.entries(description)
      .filter(([, { isFilter }]) => isFilter !== undefined)
      .map(([key]) => key);

    return (
      <form onChange={this._handleChange}>
        <h4>Generate a new file</h4>
        <h5>Main type</h5>
        <label>
          Choose a main type:
          <select
            name="main.key"
            value={description.main.key || 'entry'}
            onChange={noop}
            onBlur={noop}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <h5>Filters</h5>
        <div>
          Add a filter:
          <div className={f('button-group')}>
            {types
              .filter(
                type =>
                  type !== description.main.key && !description[type].isFilter,
              )
              .map(type => (
                <button
                  key={type}
                  type="button"
                  className={f('button')}
                  value={type}
                >
                  {type}
                </button>
              ))}
          </div>
        </div>
        <h5>More info</h5>
        <div>Corresponding API call:</div>
        <div>
          <Link href={endpoint} target="_blank">
            <code>{endpoint}</code>
          </Link>
        </div>
        <pre>{JSON.stringify(description, null, 2)}</pre>
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
