import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToLocation} from 'actions/creators';
import loadWebComponent from 'utils/loadWebComponent';


class EntryTypeFilter extends Component {
  static propTypes = {
    dataEntryType: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToLocation: T.func.isRequired,
    pathname: T.string,
    search: T.object,
  };
  componentWillMount() {
    loadWebComponent(
      () => import(
        /* webpackChunkName: "interpro-components" */'interpro-components'
      ).then(m => m.InterproType),
    ).as('interpro-type');
  }
  handleSelection = (option) => {
    this.props.goToLocation({
      pathname: this.props.pathname,
      search: {
        ...this.props.search,
        type: option === 'ALL' ? null : option,
      },
    });
  };
  render() {
    const {dataEntryType: {loading, payload}, search} = this.props;
    const types = loading ? {} : payload;
    if (!loading){
      types.ALL = Object.keys(types)
        .filter(a => a !== 'ALL')
        .reduce((acc, v) => acc + types[v], 0);
    }
    return (
      <div>
        { Object.keys(types).sort().map((type, i) => (
          <div key={i}>
            <input
              type="radio" name="entry_type" id={type} value={type}
              onChange={() => this.handleSelection(type)}
              checked={(!search.type && type === 'ALL') || search.type === type}
            />
            <label htmlFor={type}>
              {
                type === 'ALL' ? type :
                  <interpro-type type={type.replace('_', ' ')} expanded>
                    {type}
                  </interpro-type>
              }
              <small> ({types[type]})</small>
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
        if (v !== 'type' && v !== 'search' && search[v]) {
          acc.push(`${v}=${search[v]}`);
        }
        return acc;
      }, []);
    parameters.push('group_by=type');
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
})(EntryTypeFilter));
