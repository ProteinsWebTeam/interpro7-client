/* eslint no-magic-numbers: [1, {ignore: [-1, 1, 10, 25, 50, 15, 30, 100]}] */
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import { goToNewLocation, changePageSize } from 'actions/creators';

import s from './style.css';

const f = foundationPartial(s);

class PageSizeSelector extends Component {
  static propTypes = {
    location: T.object.isRequired,
    pageSize: T.number,
    changePageSize: T.func,
    goToNewLocation: T.func,
  };

  constructor(props) {
    super(props);
    const pageSize = props.location.search.page_size
      ? props.location.search.page_size
      : props.pageSize;
    this.state = { pageSize };
  }

  _handleChange = event => {
    this.setState({ pageSize: event.target.value });
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        page_size: event.target.value,
        page: 1,
      },
    });
  };

  render() {
    let options = [10, 25, 50, 100];
    if (options.indexOf(this.state.pageSize * 1) === -1) {
      options = Array.from(new Set([...options, this.state.pageSize])).sort(
        (a, b) => a - b
      );
    }
    return (
      <div className={f('table-length')}>
        Show{' '}
        <select
          className={f('small')}
          style={{ width: 'auto' }}
          value={this.state.pageSize}
          onChange={this._handleChange}
          onBlur={this._handleChange}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>{' '}
        results
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.pagination.pageSize,
  state => state.newLocation,
  (pageSize, location) => ({ pageSize, location })
);

export default connect(mapStateToProps, { changePageSize, goToNewLocation })(
  PageSizeSelector
);
