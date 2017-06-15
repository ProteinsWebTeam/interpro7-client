import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';

const label = {
  swissprot: 'Reviewed',
  trembl: 'Unreviewed',
  uniprot: 'Both',
};

class CurationFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
      description: T.shape({
        mainDB: T.string,
      }).isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  constructor() {
    super();
    this.state = {value: null};
  }

  componentWillMount() {
    const {mainDB} = this.props.location.description;
    if (mainDB === 'swissprot') {
      this.setState({value: 'swissprot'});
    } else if (mainDB === 'trembl') {
      this.setState({value: 'trembl'});
    } else {
      this.setState({value: 'uniprot'});
    }
  }

  _handleSelection = ({target: {value}}) => {
    this.setState({value});
    this.props.goToNewLocation({
      ...this.props.location,
      description: {
        ...this.props.location.description,
        mainDB: value,
      },
    });
  };

  render() {
    const {data: {loading, payload}} = this.props;
    const databases = loading ? {} : payload;
    if (!loading) {
      databases.uniprot = (databases.swissprot || 0) + (databases.trembl || 0);
    }
    return (
      <div>
        {
          Object.keys(databases).sort().map(db => (
            <div key={db}>
              <label>
                <input
                  type="radio"
                  name="curated_filter"
                  value={db}
                  onChange={this._handleSelection}
                  checked={this.state.value === db}
                /> {label[db]} <small>({databases[db]})</small>
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
    parameters.push('group_by=source_database');
    return resolve(
      format({protocol, hostname, port, pathname: root}),
      `${(root + pathname)}?${parameters.join('&')}`
        .replace('/swissprot', '/uniprot')
        .replace('/trembl', '/uniprot'),
    );
  }
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({location})
);

export default connect(mapStateToProps, {goToNewLocation})(loadData({
  getUrl: getUrlFor,
})(CurationFilter));
