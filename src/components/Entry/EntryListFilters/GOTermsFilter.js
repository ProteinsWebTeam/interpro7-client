import React, {Component} from 'react';
import T from 'prop-types';

import NumberLabel from 'components/NumberLabel';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';

import f from 'styles/foundation';

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
    const {data: {loading, payload}, location: {search}} = this.props;
    const terms = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a);
    if (!loading){
      terms.unshift(['Any']);
    }
    return (
      <div>
        {
          terms.map(([term, count]) => (
            <div key={term} className={f('column')}>
              <label className={f('row', 'align-middle')}>
                <input
                  type="radio"
                  name="go_category"
                  value={categories[term]}
                  onChange={this._handleSelection}
                  checked={
                    (term === 'Any' && !search.go_term) ||
                    search.go_term === categories[term]
                  }
                  style={{margin: '0.25em'}}
                />
                <span>{term}</span>
                {
                  typeof count === 'undefined' ?
                    null :
                    <NumberLabel value={count} />
                }
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
