import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';


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

  _handleSelection = ({target: {value}}) => {
    this.props.goToNewLocation({
      ...this.location,
      search: {
        ...this.props.location.search,
        signature_in: value === 'Any' ? null : value,
      },
    });
  };

  render() {
    const {
      data: {loading, payload},
      location: {search: {signature_in: signature}},
    } = this.props;
    const signatureDBs = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a);
    if (!loading){
      signatureDBs.unshift(['Any', 'N/A']);
    }
    return (
      <div>
        {
          signatureDBs.map(([signatureDB, count]) => (
            <div key={signatureDB}>
              <label>
                <input
                  type="radio"
                  name="interpro_state"
                  value={signatureDB}
                  onChange={this._handleSelection}
                  checked={signatureDB === 'Any' || signature === signatureDB}
                /> {signatureDB} <small>({count})</small>
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
    parameters.push('group_by=member_databases');
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
})(SignaturesFilter));
