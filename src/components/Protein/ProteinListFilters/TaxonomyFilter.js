/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import NumberLabel from 'components/NumberLabel';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';

import f from 'styles/foundation';

class TaxonomyFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    location: T.shape({
      search: T.object.isRequired,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    search: T.object,
  };

  _handleSelection = ({target: {value}}) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        tax_id: value === 'ALL' ? null : value,
      },
    });
  };

  render() {
    const {data: {loading, payload}, location: {search}} = this.props;
    const taxes = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a);
    if (!loading) {
      taxes.unshift(['ALL', NaN]);
    }
    return (
      <div style={{overflowX: 'hidden'}}>
        {
          taxes.map(([taxId, count]) => (
            <div key={taxId} className={f('column')}>
              <label className={f('row', 'align-middle')}>
                <input
                  type="radio"
                  name="entry_type"
                  value={taxId}
                  onChange={this._handleSelection}
                  checked={
                    (!search.tax_id && taxId === 'ALL') ||
                    search.tax_id === taxId
                  }
                  style={{margin: '0.25em'}}
                />
                <span>{taxId}</span>
                <NumberLabel value={count} />
              </label>
            </div>
          ))
        }
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.location,
  ({protocol, hostname, port, root}, {pathname, search}) => {
    const parameters = Object.keys(search)
      .reduce((acc, v) => {
        if (v !== 'tax_id' && v !== 'search' && search[v]) {
          acc.push(`${v}=${search[v]}`);
        }
        return acc;
      }, []);
    parameters.push('group_by=tax_id');
    return resolve(
      format({protocol, hostname, port, pathname: root}),
      `${(root + pathname)}?${parameters.join('&')}`,
    );
  }
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({location})
);

export default connect(mapStateToProps, {goToNewLocation})(loadData({
  getUrl: getUrlFor,
})(TaxonomyFilter));

