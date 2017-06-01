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
    const {dataEntryType: {loading, payload}} = this.props;
    const types = loading ? {} : payload;
    return (
      <div>
        <div>
          <input
            type="radio" name="entry_type" id="ALL" value="ALL"
            onChange={() => this.handleSelection('ALL')}
          />
          <label htmlFor="ALL">ALL</label>
        </div>
        { Object.keys(types).map((type, i) => (
          <div key={i}>
            <input
              type="radio" name="entry_type" id={type} value={type}
              onChange={() => this.handleSelection(type)}
            />
            <label htmlFor={type}>
              <interpro-type type={type.replace('_', ' ')} expanded>
                {type}
              </interpro-type>
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
  state => state.location.pathname,
  ({protocol, hostname, port, root}, pathname) => resolve(
    format({protocol, hostname, port, pathname: root}),
    `${(root + pathname)}?group_by=type`,
  )
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
