/* eslint no-magic-numbers: [1, {ignore: [-1, 1, 10, 15, 30, 100]}] */
import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {foundationPartial} from 'styles/foundation';
import {goToLocation, changePageSize} from 'actions/creators';

import s from './style.css';

const f = foundationPartial(s);

class PageSizeSelector extends Component{
  static propTypes = {
    search: T.object,
    pageSize: T.number,
    router: T.object,
    pathname: T.string,
    changePageSize: T.func,
    goToLocation: T.func,
  };

  constructor(props) {
    super(props);
    const pageSize = (
      props.search.page_size ? props.search.page_size : props.pageSize
    );
    this.state = {pageSize};
  }

  handleChange = event => {
    this.setState({pageSize: event.target.value});
    this.props.goToLocation({
      pathname: this.props.pathname,
      search: {
        ...this.props.search,
        page_size: event.target.value,
        page: 1,
      },
    });
  };

  applyAll = () => {
    this.props.changePageSize(this.state.pageSize);
  };

  render() {
    let options = [10, 15, 30, 100];
    if (options.indexOf(this.state.pageSize * 1) === -1) {
      options = Array.from(
        new Set([...options, this.state.pageSize])
      ).sort((a, b) => a - b);
    }
    return (
      <div className={f('float-left')}>
        Show{' '}
        <select
          className={f('small')}
          style={{width: 'auto'}}
          value={this.state.pageSize}
          onChange={this.handleChange}
        >
          {
            options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))
          }
        </select> results
        <a
          className={f('icon', 'icon-functional', 'primary', 'apply-all')}
          data-icon="s"
          onClick={this.applyAll}
        >
          <div>Apply to all tables</div>
        </a>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.pagination.pageSize,
  state => state.location.pathname,
  (pageSize, pathname) => ({pageSize, pathname})
);

export default connect(
  mapStateToProps,
  {changePageSize, goToLocation}
)(PageSizeSelector);
