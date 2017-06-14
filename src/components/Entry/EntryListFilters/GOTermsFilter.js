import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';

const categories = {
  'Biological Process': 'P',
  'Cellular Component': 'C',
  'Molecular Function': 'F',
};

class GOTermsFilter extends Component {
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

  _handleSelection = ({target: {value}}) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        go_term: value === 'Any' ? null : value,
      },
    });
  };

  render() {
    const {
      data: {loading, payload},
      location: {search: {go_term: go}},
    } = this.props;
    const types = loading ? {} : payload;
    // if (!loading) types.Any = Object.values(types).reduce((acc, v) => acc + v, 0);
    if (!loading){
      types.Any = 'N/A';
    }
    return (
      <div>
        {
          Object.keys(types).sort().map(type => (
            <div key={type}>
              <label>
                <input
                  type="radio"
                  name="go_category"
                  value={categories[type]}
                  onChange={this._handleSelection}
                  checked={(type === 'Any' && !go) || go === categories[type]}
                />
                {type} <small>({types[type]})</small>
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
        if (v !== 'search' && v !== 'signature_in' && v !== 'page_size' &&
          search[v]) {
          acc.push(`${v}=${search[v]}`);
        }
        return acc;
      }, []);
    parameters.push('group_by=go_terms');
    return resolve(
      format({protocol, hostname, port, pathname: root}),
      `${(root + pathname)}?${parameters.join('&')}`,
    );
  }
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({location}),
);

export default connect(mapStateToProps, {goToNewLocation})(loadData({
  getUrl: getUrlFor,
})(GOTermsFilter));
