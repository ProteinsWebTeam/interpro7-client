import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import f from 'styles/foundation';
import { goToNewLocation } from 'actions/creators';

const DEBOUNCE_RATE = 500; // In ms

class SearchBox extends Component {
  static propTypes = {
    location: T.object,
    goToNewLocation: T.func,
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = { search: this.props.location.search.search };
    this.routerPush = debounce(this.routerPush, DEBOUNCE_RATE);
  }

  handleReset = () => this.handleChange({ target: { value: null } });

  handleChange = ({ target: { value: search } }) =>
    this.setState({ search }, this.routerPush);

  routerPush = () =>
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        page: 1,
        search: this.state.search,
      },
    });

  render() {
    return (
      <div className={f('float-right')} style={{ position: 'relative' }}>
        {this.props.children || 'Search:'}
        <form style={{ display: 'inline-block', marginLeft: '1ch' }}>
          <button
            className={f('close-button')}
            type="button"
            style={{ right: '0.5rem', top: '0' }}
            onClick={this.handleReset}
          >
            <span>&times;</span>
          </button>
          <input
            id="table-filter-text"
            type="text"
            value={this.state.search || ''}
            onChange={this.handleChange}
            placeholder="Filter table"
          />
        </form>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToNewLocation })(SearchBox);
