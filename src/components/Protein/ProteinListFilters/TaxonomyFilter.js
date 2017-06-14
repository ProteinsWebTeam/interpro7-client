/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToLocation} from 'actions/creators';


class TaxonomyFilter extends Component {
  static propTypes = {
    dataEntryType: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToLocation: T.func.isRequired,
    pathname: T.string,
    search: T.object,
  };
  handleSelection = (option) => {
    this.props.goToLocation({
      pathname: this.props.pathname,
      search: {
        ...this.props.search,
        tax_id: option === 'ALL' ? null : option,
      },
    });
  };
  render() {
    const {dataEntryType: {loading, payload}, search} = this.props;
    const taxes = loading ? {} : payload;
    if (!loading){
      taxes.ALL = 'N/A';
    }
    return (
      <div style={{overflowX: 'hidden'}}>
        { Object.keys(taxes).sort().map((tax, i) => (
          <div key={i}>
            <input
              type="radio" name="entry_type" id={tax} value={tax}
              onChange={() => this.handleSelection(tax)}
              checked={(!search.tax_id && tax === 'ALL') || search.tax_id === tax}
            />
            <label htmlFor={tax}>
              {tax}
              <small> ({taxes[tax]})</small>
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
  state => state.location.pathname,
  state => state.location.search,
  (pathname, search) => ({pathname, search})
);

export default connect(mapStateToProps, {goToLocation})(loadData({
  getUrl: getUrlFor,
  propNamespace: 'EntryType',
})(TaxonomyFilter));

