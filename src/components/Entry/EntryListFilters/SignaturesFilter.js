import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToNewLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class SignaturesFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        signature_in: value === 'All' ? undefined : value,
        page: undefined,
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
      location: { search: { signature_in: signature } },
    } = this.props;
    const signatureDBs = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a)
      .filter(s => {
        const text = s[0].toLowerCase();
        return text !== 'interpro' && text !== 'mobidblt';
      });
    if (!loading) {
      signatureDBs.unshift(['All', NaN]);
    }
    return (
      <div className={f('list-sign')}>
        {signatureDBs.map(([signatureDB, count]) => (
          <div key={signatureDB} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="interpro_state"
                value={signatureDB}
                onChange={this._handleSelection}
                checked={
                  (signatureDB === 'All' && !signature) ||
                  signature === signatureDB
                }
                style={{ margin: '0.25em' }}
              />
              <span>{signatureDB}</span>
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberLabel value={count} className={f('filter-label')} />
              )}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { signature_in, search: _, page_size, ..._search } = search;
    // add to search
    _search.group_by = 'member_databases';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData({
    getUrl: getUrlFor,
  })(SignaturesFilter),
);
