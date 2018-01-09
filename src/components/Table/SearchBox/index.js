// @flow
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import { foundationPartial } from 'styles/foundation';

import s from './style.css';

const f = foundationPartial(s);

import { goToCustomLocation } from 'actions/creators';

const DEBOUNCE_RATE = 500; // In ms

class SearchBox extends Component {
  static propTypes = {
    customLocation: T.object,
    goToCustomLocation: T.func,
    children: T.any,
  };

  constructor(props) {
    super(props);

    this.state = { search: this.props.customLocation.search.search };
    this.routerPush = debounce(this.routerPush, DEBOUNCE_RATE);
  }

  handleReset = () => this.handleChange({ target: { value: null } });

  handleChange = ({ target: { value: search } }) =>
    this.setState({ search }, this.routerPush);

  routerPush = () =>
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: {
        ...this.props.customLocation.search,
        page: 1,
        search: this.state.search,
      },
    });

  render() {
    return (
      <div className={f('table-filter')}>
        <div className={f('filter-box')}>
          <input
            id="table-filter-text"
            type="text"
            value={this.state.search || ''}
            onChange={this.handleChange}
            placeholder="Filter table"
          />
          <button
            className={f('cancel-button')}
            type="button"
            aria-label="Cancel button"
            onClick={this.handleReset}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(SearchBox);
