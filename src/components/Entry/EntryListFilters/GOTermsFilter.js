import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToLocation} from 'actions/creators';


class GOTermsFilter extends Component {
  static propTypes = {
    dataIntegrated: T.shape({
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
        go_term: option === 'Any' ? null : option,
      },
    });
  };
  render() {
    const {dataIntegrated: {loading, payload}, search:{go_term:go}} = this.props;
    const types = loading ? {} : payload;
    // if (!loading) types.Any = Object.values(types).reduce((acc, v) => acc + v, 0);
    if (!loading){
      types.Any = 'N/A';
    }
    const categories = {
      'Biological Process': 'P',
      'Cellular Component': 'C',
      'Molecular Function': 'F',
    };
    return (
      <div>

        { Object.keys(types).sort().map((type, i) => (
          <div key={i}>
            <input
              type="radio" name="go_category" id={type} value={categories[type]}
              onChange={() => this.handleSelection(categories[type])}
              checked={type === 'Any' || go === categories[type]}
            />
            <label htmlFor={type}>{type} <small>({types[type]})</small></label>
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
      .reduce((acc, v)=> {
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
  state => state.location.pathname,
  state => state.location.search,
  (pathname, search) => ({pathname, search})
);

export default connect(mapStateToProps, {goToLocation})(loadData({
  getUrl: getUrlFor,
  propNamespace: 'Integrated',
})(GOTermsFilter));
