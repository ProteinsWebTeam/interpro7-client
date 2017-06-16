import React, {Component} from 'react';
import T from 'prop-types';

import NumberLabel from 'components/NumberLabel';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';

import f from 'styles/foundation';

class IntegratedFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
      description: T.object,
    }).isRequired,
  };

  constructor(){
    super();
    this.state = {value: null};
  }

  componentWillMount() {
    const integration = (
      this.props.location.description.mainIntegration ||
      this.props.location.description.focusIntegration
    );
    if (integration === 'unintegrated') {
      this.setState({value: 'unintegrated'});
    } else if (integration === 'integrated') {
      this.setState({value: 'integrated'});
    } else {
      this.setState({value: 'both'});
    }
  }

  _handleSelection = ({target: {value}}) => {
    this.setState({value});
    const integrationKey = (
      this.props.location.description.mainType === 'entry' ?
        'mainIntegration' :
        'focusIntegration'
    );
    this.props.goToNewLocation({
      ...this.props.location,
      description: {
        ...this.props.location.description,
        [integrationKey]: value === 'both' ? null : value,
      },
    });
  };

  render() {
    const {data: {loading, payload}} = this.props;
    const types = loading ? {} : payload;
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div>
        {
          Object.keys(types).sort().map(type => (
            <div key={type} className={f('column')}>
              <label className={f('row', 'align-middle')}>
                <input
                  type="radio"
                  name="interpro_state"
                  value={type}
                  onChange={this._handleSelection}
                  checked={this.state.value === type}
                  style={{margin: '0.25em'}}
                />
                <span>{type}</span>
                <NumberLabel value={types[type]} />
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
        if (v !== 'search' && search[v]) {
          acc.push(`${v}=${search[v]}`);
        }
        return acc;
      }, []);
    parameters.push('interpro_status');
    return resolve(
      format({protocol, hostname, port, pathname: root}),
      `${(root + pathname)}?${parameters.join('&')}`
        .replace('/integrated', '')
        .replace('/unintegrated', ''),
    );
  }
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({location}),
);

export default connect(mapStateToProps, {goToNewLocation})(loadData({
  getUrl: getUrlFor,
})(IntegratedFilter));
