import React, {Component} from 'react';
import T from 'prop-types';

import NumberLabel from 'components/NumberLabel';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';
import loadWebComponent from 'utils/loadWebComponent';

import f from 'styles/foundation';

class EntryTypeFilter extends Component {
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

  componentWillMount() {
    loadWebComponent(
      () => import(
        /* webpackChunkName: "interpro-components" */'interpro-components'
      ).then(m => m.InterproType),
    ).as('interpro-type');
  }

  _handleSelection = ({target: {value}}) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        type: value === 'ALL' ? null : value,
      },
    });
  };

  render() {
    const {data: {loading, payload}, location: {search}} = this.props;
    const types = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a);
    if (!loading){
      types.unshift(['ALL', types.reduce((acc, [, count]) => acc + count, 0)]);
    }
    return (
      <div>
        {
          types.map(([type, count]) => (
            <div key={type} className={f('column')}>
              <label className={f('row', 'align-middle')}>
                <input
                  type="radio"
                  name="entry_type"
                  value={type}
                  onChange={this._handleSelection}
                  checked={
                    (!search.type && type === 'ALL') || search.type === type
                  }
                  style={{margin: '0.25em'}}
                />
                {
                  type === 'ALL' ? type :
                    <interpro-type type={type.replace('_', ' ')} expanded>
                      {type}
                    </interpro-type>
                }
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
  state => state.newLocation,
  location => ({location}),
);

export default connect(mapStateToProps, {goToNewLocation})(loadData({
  getUrl: getUrlFor,
})(EntryTypeFilter));
