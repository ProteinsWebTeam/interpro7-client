import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToLocation} from 'actions/creators';


class CurationFilter extends Component {
  static propTypes = {
    dataReviewed: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToLocation: T.func.isRequired,
    pathname: T.string,
    search: T.object,
  };
  constructor(){
    super();
    this.state = {value: null};
  }
  componentWillMount() {
    if (this.props.pathname.indexOf('/swissprot') > 0) {
      this.setState({value: 'swissprot'});
    } else if (this.props.pathname.indexOf('/trembl') > 0) {
      this.setState({value: 'trembl'});
    } else {
      this.setState({value: 'uniprot'});
    }
  }
  handleSelection = (option) => {
    const path = this.props.pathname
      .replace(/\/uniprot|\/swissprot|\/trembl/, `/${option}`);
    this.setState({value: option});
    this.props.goToLocation({
      pathname: path,
      search: this.props.search,
    });
  };
  render() {
    const {dataReviewed: {loading, payload}} = this.props;
    const databases = loading ? {} : payload;
    if (!loading) databases.uniprot = databases.swissprot + databases.trembl;
    const label = {
      swissprot: 'Reviewed',
      trembl: 'Unreviewed',
      uniprot: 'Both',
    };
    return (
      <div>
        { Object.keys(databases).sort().map((db, i) => (
          <div key={i}>
            <input
              type="radio" name="curated_filter" id={db} value={db}
              onChange={() => this.handleSelection(db)}
              checked={this.state.value === db}
            />
            <label htmlFor={db}>{label[db]} <small>({databases[db]})</small></label>
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
  state => state.location.pathname,
  state => state.location.search,
  (pathname, search) => ({pathname, search})
);

export default connect(mapStateToProps, {goToLocation})(loadData({
  getUrl: getUrlFor,
  propNamespace: 'Reviewed',
})(CurationFilter));
